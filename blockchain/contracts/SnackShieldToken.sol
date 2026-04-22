// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SnackShield Reward Token (SST)
 * @notice ERC20-like reward token for supply chain participants
 * @dev Minted as rewards for genuine product verifications and supply chain compliance
 */
contract SnackShieldToken {

    string  public constant name     = "SnackShield Token";
    string  public constant symbol   = "SST";
    uint8   public constant decimals = 18;
    uint256 public totalSupply;

    address public owner;

    mapping(address => uint256)                      public balanceOf;
    mapping(address => mapping(address => uint256))  public allowance;

    // Reward configuration
    uint256 public scanReward       = 10 * 10**18;   // 10 SST per genuine scan
    uint256 public journeyReward    = 25 * 10**18;   // 25 SST per journey checkpoint
    uint256 public registrationReward = 50 * 10**18; // 50 SST per product registration

    // Authorized minters (SnackShield main contract)
    mapping(address => bool) public minters;

    // ─────────────────────────────────────────────
    //  Events (ERC20 Standard)
    // ─────────────────────────────────────────────

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event RewardMinted(address indexed to, uint256 amount, string reason);
    event MinterUpdated(address indexed minter, bool status);

    // ─────────────────────────────────────────────
    //  Modifiers
    // ─────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "SST: not owner");
        _;
    }

    modifier onlyMinter() {
        require(msg.sender == owner || minters[msg.sender], "SST: not minter");
        _;
    }

    // ─────────────────────────────────────────────
    //  Constructor
    // ─────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        
        // Mint initial supply to deployer (1,000,000 SST)
        uint256 initialSupply = 1_000_000 * 10**18;
        balanceOf[msg.sender] = initialSupply;
        totalSupply = initialSupply;
        
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    // ─────────────────────────────────────────────
    //  ERC20 Standard Functions
    // ─────────────────────────────────────────────

    function transfer(address _to, uint256 _value) external returns (bool) {
        require(_to != address(0), "SST: transfer to zero address");
        require(balanceOf[msg.sender] >= _value, "SST: insufficient balance");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) external returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool) {
        require(_to != address(0), "SST: transfer to zero address");
        require(balanceOf[_from] >= _value, "SST: insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "SST: insufficient allowance");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // ─────────────────────────────────────────────
    //  Reward Minting
    // ─────────────────────────────────────────────

    /**
     * @notice Mint scan reward tokens to a user
     * @param _to  Address of the scanner to reward
     */
    function mintScanReward(address _to) external onlyMinter {
        _mint(_to, scanReward);
        emit RewardMinted(_to, scanReward, "Product scan verification");
    }

    /**
     * @notice Mint journey checkpoint reward tokens
     * @param _to  Address of the partner to reward
     */
    function mintJourneyReward(address _to) external onlyMinter {
        _mint(_to, journeyReward);
        emit RewardMinted(_to, journeyReward, "Journey checkpoint logged");
    }

    /**
     * @notice Mint product registration reward tokens
     * @param _to  Address of the registrant to reward
     */
    function mintRegistrationReward(address _to) external onlyMinter {
        _mint(_to, registrationReward);
        emit RewardMinted(_to, registrationReward, "Product registered on-chain");
    }

    /**
     * @notice Mint arbitrary amount (only by owner)
     */
    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    // ─────────────────────────────────────────────
    //  Admin Functions
    // ─────────────────────────────────────────────

    /**
     * @notice Set minter authorization (SnackShield main contract)
     */
    function setMinter(address _minter, bool _status) external onlyOwner {
        minters[_minter] = _status;
        emit MinterUpdated(_minter, _status);
    }

    /**
     * @notice Update reward amounts
     */
    function updateRewards(
        uint256 _scanReward,
        uint256 _journeyReward,
        uint256 _registrationReward
    ) external onlyOwner {
        scanReward = _scanReward;
        journeyReward = _journeyReward;
        registrationReward = _registrationReward;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "SST: zero address");
        owner = _newOwner;
    }

    // ─────────────────────────────────────────────
    //  Internal
    // ─────────────────────────────────────────────

    function _mint(address _to, uint256 _amount) internal {
        require(_to != address(0), "SST: mint to zero address");
        totalSupply += _amount;
        balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }
}
