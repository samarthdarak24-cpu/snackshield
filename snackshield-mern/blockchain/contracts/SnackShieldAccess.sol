// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SnackShieldAccess
 * @notice Role-based access control for the SnackShield supply chain.
 *         Manages partner registration and role assignment:
 *           0 = Admin
 *           1 = Manufacturer
 *           2 = Distributor
 *           3 = Retailer
 *           4 = Customer
 */
contract SnackShieldAccess {
    // ─── Types ────────────────────────────────────────────────────────────────

    enum Role { Admin, Manufacturer, Distributor, Retailer, Customer }

    struct Partner {
        address wallet;
        string  name;
        string  company;
        Role    role;
        bool    isActive;
        uint256 registeredAt;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    address public owner;

    mapping(address => Partner) public partners;
    address[] public partnerAddresses;
    uint256   public partnerCount;

    // ─── Events ───────────────────────────────────────────────────────────────

    event PartnerRegistered(
        address indexed wallet,
        string  name,
        string  company,
        Role    role,
        uint256 timestamp
    );
    event RoleUpdated(
        address indexed wallet,
        Role    oldRole,
        Role    newRole,
        uint256 timestamp
    );
    event PartnerDeactivated(address indexed wallet, uint256 timestamp);
    event PartnerReactivated(address indexed wallet, uint256 timestamp);

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Access: not owner");
        _;
    }

    modifier partnerExists(address _wallet) {
        require(partners[_wallet].wallet != address(0), "Access: partner not found");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;

        // Register deployer as Admin partner
        _registerPartner(msg.sender, "SnackShield Admin", "SnackShield Inc.", Role.Admin);
    }

    // ─── Partner Management ───────────────────────────────────────────────────

    /**
     * @notice Register a new supply chain partner.
     */
    function registerPartner(
        address _wallet,
        string calldata _name,
        string calldata _company,
        Role _role
    ) external onlyOwner {
        require(partners[_wallet].wallet == address(0), "Access: already registered");
        _registerPartner(_wallet, _name, _company, _role);
    }

    /**
     * @notice Update a partner's role.
     */
    function updateRole(address _wallet, Role _newRole)
        external onlyOwner partnerExists(_wallet)
    {
        Role oldRole = partners[_wallet].role;
        partners[_wallet].role = _newRole;
        emit RoleUpdated(_wallet, oldRole, _newRole, block.timestamp);
    }

    /**
     * @notice Deactivate a partner (suspend access).
     */
    function deactivatePartner(address _wallet)
        external onlyOwner partnerExists(_wallet)
    {
        partners[_wallet].isActive = false;
        emit PartnerDeactivated(_wallet, block.timestamp);
    }

    /**
     * @notice Reactivate a previously deactivated partner.
     */
    function reactivatePartner(address _wallet)
        external onlyOwner partnerExists(_wallet)
    {
        partners[_wallet].isActive = true;
        emit PartnerReactivated(_wallet, block.timestamp);
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Access: zero address");
        owner = _newOwner;
    }

    // ─── View Functions ───────────────────────────────────────────────────────

    function getPartner(address _wallet)
        external view partnerExists(_wallet)
        returns (
            string memory name,
            string memory company,
            Role   role,
            bool   isActive,
            uint256 registeredAt
        )
    {
        Partner storage p = partners[_wallet];
        return (p.name, p.company, p.role, p.isActive, p.registeredAt);
    }

    function isActivePartner(address _wallet) external view returns (bool) {
        return partners[_wallet].isActive;
    }

    function hasRole(address _wallet, Role _role) external view returns (bool) {
        Partner storage p = partners[_wallet];
        return p.isActive && p.role == _role;
    }

    function getAllPartners() external view returns (address[] memory) {
        return partnerAddresses;
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _registerPartner(
        address _wallet,
        string memory _name,
        string memory _company,
        Role _role
    ) internal {
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
}
