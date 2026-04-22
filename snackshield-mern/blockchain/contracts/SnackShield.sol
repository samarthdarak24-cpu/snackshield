// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SnackShield
 * @notice Core product authentication & supply chain tracking contract.
 *         Stores product registrations, scan history, and journey steps
 *         immutably on-chain. Computes a trust index per product.
 */
contract SnackShield {
    // ─── Structs ──────────────────────────────────────────────────────────────

    struct Product {
        string  productName;
        string  company;
        string  batchId;
        string  qrCodeHash;       // original QR string stored for lookup
        uint256 manufactureDate;  // unix timestamp
        uint256 expiryDate;       // unix timestamp
        address registeredBy;
        bool    exists;
        bool    revoked;
        uint256 totalScans;
        uint256 suspiciousScans;
    }

    struct Batch {
        string  batchId;
        string  productName;
        uint256 manufactureDate;
        uint256 expiryDate;
        uint256 quantity;
        address registeredBy;
        bool    exists;
    }

    struct ScanRecord {
        address scanner;
        string  result;    // "Genuine" | "Fake" | "Suspicious"
        string  location;
        uint256 timestamp;
    }

    struct JourneyStep {
        string  role;      // Manufacturer | Distributor | Retailer | Customer
        string  location;
        string  city;
        string  country;
        uint256 timestamp;
        string  status;    // Verified | In Transit | Delivered | Suspicious
        address recorder;
        string  notes;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    address public owner;

    mapping(bytes32 => Product)      public products;
    mapping(bytes32 => Batch)        public batches;
    mapping(bytes32 => ScanRecord[]) public scanHistory;
    mapping(bytes32 => JourneyStep[]) public journeyHistory;
    mapping(string  => bytes32)      private qrToProductId;   // QR string → productId
    mapping(address => bool)         public authorizedPartners;

    bytes32[] public productIds;
    uint256   public productCount;
    uint256   public batchCount;
    uint256   public totalScans;

    // ─── Events ───────────────────────────────────────────────────────────────

    event ProductRegistered(
        bytes32 indexed productId,
        string  productName,
        string  company,
        string  batchId,
        address indexed registeredBy,
        uint256 timestamp
    );
    event BatchRegistered(
        bytes32 indexed batchHash,
        string  batchId,
        string  productName,
        uint256 quantity,
        address indexed registeredBy,
        uint256 timestamp
    );
    event ProductScanned(
        bytes32 indexed productId,
        string  result,
        string  location,
        address indexed scanner,
        uint256 timestamp
    );
    event JourneyUpdated(
        bytes32 indexed productId,
        string  role,
        string  location,
        string  status,
        address indexed recorder,
        uint256 timestamp
    );
    event ProductRevoked(
        bytes32 indexed productId,
        address indexed revokedBy,
        uint256 timestamp
    );
    event PartnerAuthorized(address indexed partner, uint256 timestamp);
    event PartnerRevoked(address indexed partner, uint256 timestamp);
    event AlertRaised(
        bytes32 indexed productId,
        string  alertType,
        string  message,
        uint256 severity,
        uint256 timestamp
    );

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "SnackShield: not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == owner || authorizedPartners[msg.sender],
            "SnackShield: not authorized"
        );
        _;
    }

    modifier productExists(bytes32 _productId) {
        require(products[_productId].exists, "SnackShield: product not found");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        authorizedPartners[msg.sender] = true;
    }

    // ─── Partner Management ───────────────────────────────────────────────────

    function authorizePartner(address _partner) external onlyOwner {
        authorizedPartners[_partner] = true;
        emit PartnerAuthorized(_partner, block.timestamp);
    }

    function revokePartner(address _partner) external onlyOwner {
        authorizedPartners[_partner] = false;
        emit PartnerRevoked(_partner, block.timestamp);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "SnackShield: zero address");
        owner = _newOwner;
    }

    // ─── Batch Registration ───────────────────────────────────────────────────

    /**
     * @notice Register a production batch on-chain.
     * @return batchHash keccak256 of the batchId string
     */
    function registerBatch(
        string calldata _batchId,
        string calldata _productName,
        uint256 _manufactureDate,
        uint256 _expiryDate,
        uint256 _quantity
    ) external onlyAuthorized returns (bytes32 batchHash) {
        batchHash = keccak256(abi.encodePacked(_batchId));
        require(!batches[batchHash].exists, "SnackShield: batch already registered");

        batches[batchHash] = Batch({
            batchId:         _batchId,
            productName:     _productName,
            manufactureDate: _manufactureDate,
            expiryDate:      _expiryDate,
            quantity:        _quantity,
            registeredBy:    msg.sender,
            exists:          true
        });

        batchCount++;
        emit BatchRegistered(batchHash, _batchId, _productName, _quantity, msg.sender, block.timestamp);
    }

    // ─── Product Registration ─────────────────────────────────────────────────

    /**
     * @notice Register a single product unit with its QR code.
     * @return productId keccak256 of the qrCode string
     */
    function registerProduct(
        string calldata _productName,
        string calldata _company,
        string calldata _batchId,
        string calldata _qrCode,
        uint256 _manufactureDate,
        uint256 _expiryDate
    ) external onlyAuthorized returns (bytes32 productId) {
        productId = keccak256(abi.encodePacked(_qrCode));
        require(!products[productId].exists, "SnackShield: product already registered");

        products[productId] = Product({
            productName:     _productName,
            company:         _company,
            batchId:         _batchId,
            qrCodeHash:      _qrCode,
            manufactureDate: _manufactureDate,
            expiryDate:      _expiryDate,
            registeredBy:    msg.sender,
            exists:          true,
            revoked:         false,
            totalScans:      0,
            suspiciousScans: 0
        });

        qrToProductId[_qrCode] = productId;
        productIds.push(productId);
        productCount++;

        // Add initial journey step
        journeyHistory[productId].push(JourneyStep({
            role:      "Manufacturer",
            location:  "Factory",
            city:      "Mumbai",
            country:   "India",
            timestamp: block.timestamp,
            status:    "Verified",
            recorder:  msg.sender,
            notes:     "Product registered on blockchain"
        }));

        emit ProductRegistered(productId, _productName, _company, _batchId, msg.sender, block.timestamp);
    }

    // ─── Scan Recording ───────────────────────────────────────────────────────

    /**
     * @notice Record a product scan. Anyone can scan (public verification).
     * @param _productId  keccak256 of the QR code
     * @param _result     "Genuine" | "Fake" | "Suspicious"
     * @param _location   scan location string
     */
    function scanProduct(
        bytes32 _productId,
        string calldata _result,
        string calldata _location
    ) external productExists(_productId) {
        require(!products[_productId].revoked, "SnackShield: product revoked");

        scanHistory[_productId].push(ScanRecord({
            scanner:   msg.sender,
            result:    _result,
            location:  _location,
            timestamp: block.timestamp
        }));

        products[_productId].totalScans++;
        totalScans++;

        // Track suspicious scans
        if (
            keccak256(bytes(_result)) == keccak256(bytes("Fake")) ||
            keccak256(bytes(_result)) == keccak256(bytes("Suspicious"))
        ) {
            products[_productId].suspiciousScans++;

            // Auto-raise alert if suspicious ratio > 20%
            uint256 ratio = (products[_productId].suspiciousScans * 100) /
                             products[_productId].totalScans;
            if (ratio > 20) {
                emit AlertRaised(
                    _productId,
                    "Suspicious Pattern",
                    "High suspicious scan ratio detected",
                    2,
                    block.timestamp
                );
            }
        }

        emit ProductScanned(_productId, _result, _location, msg.sender, block.timestamp);
    }

    // ─── Journey Tracking ─────────────────────────────────────────────────────

    /**
     * @notice Add a supply chain journey step for a product.
     */
    function addJourneyStep(
        bytes32 _productId,
        string calldata _role,
        string calldata _location,
        string calldata _city,
        string calldata _country,
        string calldata _status,
        string calldata _notes
    ) external onlyAuthorized productExists(_productId) {
        require(!products[_productId].revoked, "SnackShield: product revoked");

        journeyHistory[_productId].push(JourneyStep({
            role:      _role,
            location:  _location,
            city:      _city,
            country:   _country,
            timestamp: block.timestamp,
            status:    _status,
            recorder:  msg.sender,
            notes:     _notes
        }));

        emit JourneyUpdated(_productId, _role, _location, _status, msg.sender, block.timestamp);
    }

    // ─── Product Revocation ───────────────────────────────────────────────────

    function revokeProduct(bytes32 _productId)
        external onlyOwner productExists(_productId)
    {
        products[_productId].revoked = true;
        emit ProductRevoked(_productId, msg.sender, block.timestamp);
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    /**
     * @notice Verify a product by its QR code string.
     * @return isGenuine  true if registered and not revoked
     * @return productName
     * @return company
     * @return scanCount  total scans recorded
     */
    function verifyProduct(string calldata _qrCode)
        external view
        returns (
            bool    isGenuine,
            string  memory productName,
            string  memory company,
            uint256 scanCount
        )
    {
        bytes32 pid = qrToProductId[_qrCode];
        if (pid == bytes32(0) || !products[pid].exists) {
            return (false, "", "", 0);
        }
        Product storage p = products[pid];
        isGenuine   = !p.revoked;
        productName = p.productName;
        company     = p.company;
        scanCount   = p.totalScans;
    }

    /**
     * @notice Get full product details by productId (bytes32).
     */
    function getProduct(bytes32 _productId)
        external view productExists(_productId)
        returns (
            string  memory productName,
            string  memory company,
            string  memory batchId,
            uint256 manufactureDate,
            uint256 expiryDate,
            bool    revoked,
            uint256 scanCount,
            uint256 suspiciousCount,
            uint256 journeySteps
        )
    {
        Product storage p = products[_productId];
        return (
            p.productName,
            p.company,
            p.batchId,
            p.manufactureDate,
            p.expiryDate,
            p.revoked,
            p.totalScans,
            p.suspiciousScans,
            journeyHistory[_productId].length
        );
    }

    /**
     * @notice Get full scan history for a product.
     */
    function getScanHistory(bytes32 _productId)
        external view
        returns (ScanRecord[] memory)
    {
        return scanHistory[_productId];
    }

    /**
     * @notice Get full journey history for a product.
     */
    function getJourneyHistory(bytes32 _productId)
        external view
        returns (JourneyStep[] memory)
    {
        return journeyHistory[_productId];
    }

    /**
     * @notice Compute a trust index (0–100) for a product.
     *         100 = fully trusted, decreases with suspicious scans.
     */
    function getTrustIndex(bytes32 _productId)
        external view
        returns (uint256 trustIndex)
    {
        if (!products[_productId].exists) return 0;
        Product storage p = products[_productId];
        if (p.revoked) return 0;
        if (p.totalScans == 0) return 100;

        uint256 suspiciousRatio = (p.suspiciousScans * 100) / p.totalScans;
        trustIndex = suspiciousRatio >= 100 ? 0 : 100 - suspiciousRatio;
    }

    /**
     * @notice Global platform statistics.
     */
    function getGlobalStats()
        external view
        returns (
            uint256 _productCount,
            uint256 _batchCount,
            uint256 _totalScans
        )
    {
        return (productCount, batchCount, totalScans);
    }
}
