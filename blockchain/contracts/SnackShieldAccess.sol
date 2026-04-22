// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SnackShield Access Control
 * @notice Role-based access control for the SnackShield supply chain
 * @dev Manages Manufacturer, Distributor, Retailer, and Admin roles on-chain
 */
contract SnackShieldAccess {

    // ─────────────────────────────────────────────
    //  Enums & Structs
    // ─────────────────────────────────────────────

    enum Role {
        None,
        Manufacturer,
        Distributor,
        Retailer,
        Admin
    }

    struct Partner {
        address wallet;
        string  name;
        string  company;
        Role    role;
        bool    isActive;
        uint256 registeredAt;
    }

    // ─────────────────────────────────────────────
    //  State Variables
    // ─────────────────────────────────────────────

    address public owner;
    uint256 public partnerCount;

    mapping(address => Partner) public partners;
    address[] public partnerAddresses;

    // ─────────────────────────────────────────────
    //  Events
    // ─────────────────────────────────────────────

    event PartnerRegistered(
        address indexed wallet,
        string  name,
        string  company,
        Role    role,
        uint256 timestamp
    );

    event PartnerDeactivated(address indexed wallet, uint256 timestamp);
    event PartnerReactivated(address indexed wallet, uint256 timestamp);
    event RoleUpdated(address indexed wallet, Role oldRole, Role newRole, uint256 timestamp);

    // ─────────────────────────────────────────────
    //  Modifiers
    // ─────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "AccessControl: not owner");
        _;
    }

    modifier onlyAdmin() {
        require(
            msg.sender == owner || partners[msg.sender].role == Role.Admin,
            "AccessControl: not admin"
        );
        _;
    }

    modifier onlyActivePartner() {
        require(partners[msg.sender].isActive, "AccessControl: not active partner");
        _;
    }

    // ─────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        
        // Register deployer as Admin
        partners[msg.sender] = Partner({
            wallet:       msg.sender,
            name:         "System Admin",
            company:      "SnackShield Enterprise",
            role:         Role.Admin,
            isActive:     true,
            registeredAt: block.timestamp
        });

        partnerAddresses.push(msg.sender);
        partnerCount++;

        emit PartnerRegistered(
            msg.sender,
            "System Admin",
            "SnackShield Enterprise",
            Role.Admin,
            block.timestamp
        );
    }

    // ─────────────────────────────────────────────
    //  Partner Management
    // ─────────────────────────────────────────────

    /**
     * @notice Register a new supply chain partner
     * @param _wallet   Partner's Ethereum address
     * @param _name     Partner representative name
     * @param _company  Partner company name
     * @param _role     Partner role (1=Manufacturer, 2=Distributor, 3=Retailer, 4=Admin)
     */
    function registerPartner(
        address _wallet,
        string calldata _name,
        string calldata _company,
        Role _role
    ) external onlyAdmin {
        require(_wallet != address(0), "AccessControl: zero address");
        require(!partners[_wallet].isActive, "AccessControl: already registered");
        require(_role != Role.None, "AccessControl: invalid role");

        partners[_wallet] = Partner({
            wallet:       _wallet,
            name:         _name,
            company:      _company,
            role:         _role,
            isActive:     true,
            registeredAt: block.timestamp
        });

        partnerAddresses.push(_wallet);
        partnerCount++;

        emit PartnerRegistered(_wallet, _name, _company, _role, block.timestamp);
    }

    /**
     * @notice Deactivate a partner (revoke access without deleting)
     * @param _wallet  Partner's Ethereum address
     */
    function deactivatePartner(address _wallet) external onlyAdmin {
        require(partners[_wallet].isActive, "AccessControl: not active");
        require(_wallet != owner, "AccessControl: cannot deactivate owner");
        partners[_wallet].isActive = false;
        emit PartnerDeactivated(_wallet, block.timestamp);
    }

    /**
     * @notice Reactivate a previously deactivated partner
     * @param _wallet  Partner's Ethereum address
     */
    function reactivatePartner(address _wallet) external onlyAdmin {
        require(!partners[_wallet].isActive, "AccessControl: already active");
        require(partners[_wallet].registeredAt > 0, "AccessControl: not registered");
        partners[_wallet].isActive = true;
        emit PartnerReactivated(_wallet, block.timestamp);
    }

    /**
     * @notice Update a partner's role
     * @param _wallet   Partner's Ethereum address
     * @param _newRole  New role to assign
     */
    function updateRole(address _wallet, Role _newRole) external onlyAdmin {
        require(partners[_wallet].isActive, "AccessControl: not active");
        require(_newRole != Role.None, "AccessControl: invalid role");
        
        Role oldRole = partners[_wallet].role;
        partners[_wallet].role = _newRole;
        
        emit RoleUpdated(_wallet, oldRole, _newRole, block.timestamp);
    }

    // ─────────────────────────────────────────────
    //  View Functions
    // ─────────────────────────────────────────────

    /**
     * @notice Check if an address has a specific role
     */
    function hasRole(address _wallet, Role _role) external view returns (bool) {
        return partners[_wallet].isActive && partners[_wallet].role == _role;
    }

    /**
     * @notice Check if an address is an active partner
     */
    function isActivePartner(address _wallet) external view returns (bool) {
        return partners[_wallet].isActive;
    }

    /**
     * @notice Get partner details
     */
    function getPartner(address _wallet)
        external
        view
        returns (
            string memory name,
            string memory company,
            Role role,
            bool isActive,
            uint256 registeredAt
        )
    {
        Partner storage p = partners[_wallet];
        return (p.name, p.company, p.role, p.isActive, p.registeredAt);
    }

    /**
     * @notice Get all partner addresses
     */
    function getAllPartners() external view returns (address[] memory) {
        return partnerAddresses;
    }

    /**
     * @notice Transfer contract ownership
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "AccessControl: zero address");
        owner = _newOwner;
    }
}
