// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SnackShield - AI & Blockchain Based Fake Product Detection
 * @author SnackShield Enterprise
 * @notice This contract manages immutable product registration, batch tracking,
 *         supply chain journey logging, and scan verification on-chain.
 * @dev Deployed on Ethereum-compatible chains (Ganache local / Sepolia testnet)
 */
contract SnackShield {

    // ─────────────────────────────────────────────
    //  Structs
    // ─────────────────────────────────────────────

    struct Product {
        string  productName;
        string  company;
        string  batchId;
        string  qrCodeHash;        // keccak256 of the QR code payload
        uint256 manufactureDate;
        uint256 expiryDate;
        address registeredBy;
        bool    exists;
        bool    revoked;           // flagged as counterfeit / recalled
        uint256 totalScans;
        uint256 suspiciousScans;
    }

    struct JourneyStep {
        string  role;              // Manufacturer | Distributor | Retailer | Customer
        string  location;
        string  city;
        string  country;
        uint256 timestamp;
        string  status;            // Verified | In Transit | Delivered | Suspicious
        address recorder;
        string  notes;
    }

    struct ScanRecord {
        address scanner;
        string  result;            // Genuine | Fake | Suspicious
        string  location;
        uint256 timestamp;
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

    // ─────────────────────────────────────────────
    //  State Variables
    // ─────────────────────────────────────────────

    address public owner;
    uint256 public productCount;
    uint256 public batchCount;
    uint256 public totalScans;

    /// @dev Product ID (bytes32 hash) → Product data
    mapping(bytes32 => Product)        public products;
    /// @dev Product ID → journey steps array
    mapping(bytes32 => JourneyStep[])  public journeyHistory;
    /// @dev Product ID → scan records array
    mapping(bytes32 => ScanRecord[])   public scanHistory;
    /// @dev Batch ID hash → Batch data
    mapping(bytes32 => Batch)          public batches;
    /// @dev Address → authorised supply chain partner
    mapping(address => bool)           public authorizedPartners;
    /// @dev Track all registered product IDs
    bytes32[] public productIds;

    // ─────────────────────────────────────────────
    //  Events
    // ─────────────────────────────────────────────

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

    event JourneyUpdated(
        bytes32 indexed productId,
        string  role,
        string  location,
        string  status,
        address indexed recorder,
        uint256 timestamp
    );

    event ProductScanned(
        bytes32 indexed productId,
        string  result,
        string  location,
        address indexed scanner,
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

    // ─────────────────────────────────────────────
    //  Modifiers
    // ─────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "SnackShield: caller is not owner");
        _;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == owner || authorizedPartners[msg.sender],
            "SnackShield: caller is not authorized"
        );
        _;
    }

    modifier productExists(bytes32 _productId) {
        require(products[_productId].exists, "SnackShield: product does not exist");
        _;
    }

    modifier productNotRevoked(bytes32 _productId) {
        require(!products[_productId].revoked, "SnackShield: product has been revoked");
        _;
    }

    // ─────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        authorizedPartners[msg.sender] = true;
        emit PartnerAuthorized(msg.sender, block.timestamp);
    }

    // ─────────────────────────────────────────────
    //  Partner Management
    // ─────────────────────────────────────────────

    /**
     * @notice Authorize a new supply chain partner address
     * @param _partner  Wallet address of the partner to authorize
     */
    function authorizePartner(address _partner) external onlyOwner {
        require(_partner != address(0), "SnackShield: zero address");
        require(!authorizedPartners[_partner], "SnackShield: already authorized");
        authorizedPartners[_partner] = true;
        emit PartnerAuthorized(_partner, block.timestamp);
    }

    /**
     * @notice Revoke a supply chain partner's authorization
     * @param _partner  Wallet address of the partner to revoke
     */
    function revokePartner(address _partner) external onlyOwner {
        require(authorizedPartners[_partner], "SnackShield: not authorized");
        authorizedPartners[_partner] = false;
        emit PartnerRevoked(_partner, block.timestamp);
    }

    // ─────────────────────────────────────────────
    //  Batch Registration
    // ─────────────────────────────────────────────

    /**
     * @notice Register a new production batch on-chain
     * @param _batchId          Unique batch identifier (e.g. "BCH-8N202X")
     * @param _productName      Name of the product in this batch
     * @param _manufactureDate  Unix timestamp of manufacture date
     * @param _expiryDate       Unix timestamp of expiry date
     * @param _quantity          Number of units in this batch
     * @return batchHash         The keccak256 hash used as the batch key
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
            batchId:          _batchId,
            productName:      _productName,
            manufactureDate:  _manufactureDate,
            expiryDate:       _expiryDate,
            quantity:         _quantity,
            registeredBy:     msg.sender,
            exists:           true
        });

        batchCount++;

        emit BatchRegistered(
            batchHash,
            _batchId,
            _productName,
            _quantity,
            msg.sender,
            block.timestamp
        );
    }

    // ─────────────────────────────────────────────
    //  Product Registration
    // ─────────────────────────────────────────────

    /**
     * @notice Register a new product on the blockchain
     * @param _productName      Human-readable product name
     * @param _company          Manufacturer / company name
     * @param _batchId          Associated batch identifier
     * @param _qrCode           Raw QR code payload string
     * @param _manufactureDate  Unix timestamp of manufacture
     * @param _expiryDate       Unix timestamp of expiry
     * @return productId        The keccak256 hash used as the product key
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

        productIds.push(productId);
        productCount++;

        // Automatically add the first journey step (Manufacturer registration)
        journeyHistory[productId].push(JourneyStep({
            role:      "Manufacturer",
            location:  _company,
            city:      "",
            country:   "",
            timestamp: block.timestamp,
            status:    "Verified",
            recorder:  msg.sender,
            notes:     "Product registered on blockchain"
        }));

        emit ProductRegistered(
            productId,
            _productName,
            _company,
            _batchId,
            msg.sender,
            block.timestamp
        );
    }

    // ─────────────────────────────────────────────
    //  Supply Chain Journey Tracking
    // ─────────────────────────────────────────────

    /**
     * @notice Add a new journey checkpoint for a product
     * @param _productId  The product hash identifier
     * @param _role       Role at this checkpoint (Manufacturer/Distributor/Retailer/Customer)
     * @param _location   Facility or location name
     * @param _city       City name
     * @param _country    Country name
     * @param _status     Current status at this checkpoint
     * @param _notes      Additional notes
     */
    function addJourneyStep(
        bytes32 _productId,
        string calldata _role,
        string calldata _location,
        string calldata _city,
        string calldata _country,
        string calldata _status,
        string calldata _notes
    ) external onlyAuthorized productExists(_productId) productNotRevoked(_productId) {
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

        // Auto-raise alert if status is Suspicious
        if (keccak256(bytes(_status)) == keccak256(bytes("Suspicious"))) {
            products[_productId].suspiciousScans++;
            emit AlertRaised(
                _productId,
                "JOURNEY_ANOMALY",
                string(abi.encodePacked("Suspicious activity detected at ", _location)),
                3,
                block.timestamp
            );
        }

        emit JourneyUpdated(
            _productId,
            _role,
            _location,
            _status,
            msg.sender,
            block.timestamp
        );
    }

    // ─────────────────────────────────────────────
    //  Product Scanning & Verification
    // ─────────────────────────────────────────────

    /**
     * @notice Record a product scan/verification event
     * @param _productId  The product hash identifier
     * @param _result     Scan result: "Genuine", "Fake", or "Suspicious"
     * @param _location   Where the scan occurred
     */
    function scanProduct(
        bytes32 _productId,
        string calldata _result,
        string calldata _location
    ) external productExists(_productId) {
        scanHistory[_productId].push(ScanRecord({
            scanner:   msg.sender,
            result:    _result,
            location:  _location,
            timestamp: block.timestamp
        }));

        products[_productId].totalScans++;
        totalScans++;

        // If fake or suspicious, increment suspicious counter and raise alert
        if (
            keccak256(bytes(_result)) == keccak256(bytes("Fake")) ||
            keccak256(bytes(_result)) == keccak256(bytes("Suspicious"))
        ) {
            products[_productId].suspiciousScans++;

            uint256 severity = keccak256(bytes(_result)) == keccak256(bytes("Fake")) ? 5 : 3;

            emit AlertRaised(
                _productId,
                "COUNTERFEIT_DETECTED",
                string(abi.encodePacked(_result, " product detected at ", _location)),
                severity,
                block.timestamp
            );
        }

        emit ProductScanned(
            _productId,
            _result,
            _location,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @notice Verify if a product is genuine (exists on-chain and not revoked)
     * @param _qrCode  The raw QR code payload to verify
     * @return isGenuine  Whether the product is registered and not revoked
     * @return productName  Name of the product (empty if not found)
     * @return company      Company name (empty if not found)
     * @return scanCount    Total number of scans recorded
     */
    function verifyProduct(string calldata _qrCode) 
        external 
        view 
        returns (
            bool isGenuine,
            string memory productName,
            string memory company,
            uint256 scanCount
        ) 
    {
        bytes32 productId = keccak256(abi.encodePacked(_qrCode));
        Product storage p = products[productId];

        if (p.exists && !p.revoked) {
            return (true, p.productName, p.company, p.totalScans);
        }
        return (false, "", "", 0);
    }

    // ─────────────────────────────────────────────
    //  Product Revocation (Recall / Counterfeit Flag)
    // ─────────────────────────────────────────────

    /**
     * @notice Revoke/flag a product as counterfeit or recalled
     * @param _productId  The product hash identifier
     */
    function revokeProduct(bytes32 _productId) 
        external 
        onlyAuthorized 
        productExists(_productId) 
    {
        require(!products[_productId].revoked, "SnackShield: already revoked");
        products[_productId].revoked = true;

        emit ProductRevoked(_productId, msg.sender, block.timestamp);
        emit AlertRaised(
            _productId,
            "PRODUCT_REVOKED",
            "Product has been revoked from the supply chain",
            5,
            block.timestamp
        );
    }

    // ─────────────────────────────────────────────
    //  View / Query Functions
    // ─────────────────────────────────────────────

    /**
     * @notice Get the full journey history of a product
     * @param _productId  The product hash identifier
     * @return Array of JourneyStep structs
     */
    function getJourneyHistory(bytes32 _productId) 
        external 
        view 
        productExists(_productId) 
        returns (JourneyStep[] memory) 
    {
        return journeyHistory[_productId];
    }

    /**
     * @notice Get all scan records for a product
     * @param _productId  The product hash identifier
     * @return Array of ScanRecord structs
     */
    function getScanHistory(bytes32 _productId) 
        external 
        view 
        productExists(_productId) 
        returns (ScanRecord[] memory) 
    {
        return scanHistory[_productId];
    }

    /**
     * @notice Get the product details by its ID hash
     * @param _productId  The product hash identifier
     */
    function getProduct(bytes32 _productId)
        external
        view
        productExists(_productId)
        returns (
            string memory productName,
            string memory company,
            string memory batchId,
            uint256 manufactureDate,
            uint256 expiryDate,
            bool revoked,
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
     * @notice Calculate on-chain trust index (% of genuine scans)
     * @param _productId  The product hash identifier
     * @return trustIndex  Percentage (0-100) of non-suspicious scans
     */
    function getTrustIndex(bytes32 _productId) 
        external 
        view 
        productExists(_productId) 
        returns (uint256 trustIndex) 
    {
        Product storage p = products[_productId];
        if (p.totalScans == 0) return 100;
        trustIndex = ((p.totalScans - p.suspiciousScans) * 100) / p.totalScans;
    }

    /**
     * @notice Get global platform statistics
     * @return _productCount   Total registered products
     * @return _batchCount     Total registered batches
     * @return _totalScans     Total scan events recorded
     */
    function getGlobalStats()
        external
        view
        returns (
            uint256 _productCount,
            uint256 _batchCount,
            uint256 _totalScans
        )
    {
        return (productCount, batchCount, totalScans);
    }

    /**
     * @notice Transfer contract ownership
     * @param _newOwner  Address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "SnackShield: zero address");
        owner = _newOwner;
    }
}
