// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SnackShieldToken (SST)
 * @notice ERC-20 reward token for the SnackShield ecosystem.
 *         Minted as incentives for:
 *           - Registering products (registrationReward)
 *           - Recording journey steps (journeyReward)
 *           - Scanning / verifying products (scanReward)
 *
 *         Only addresses granted the minter role can mint tokens.
 */
contract SnackShieldToken {
    // ─── ERC-20 State ─────────────────────────────────────────────────────────

    string  public name     = "SnackShield Token";
    string  public symbol   = "SST";
    uint8   public decimals = 18;

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // ─── Access ───────────────────────────────────────────────────────────────

    address public owner;
    mapping(address => bool) public minters;

    // ─── Reward Config ────────────────────────────────────────────────────────

    uint256 public scanReward         = 1  * 10 ** 18;  // 1 SST per scan
    uint256 public journeyReward      = 5  * 10 ** 18;  // 5 SST per journey step
    uint256 public registrationReward = 10 * 10 ** 18;  // 10 SST per product registered

    // ─── Events ───────────────────────────────────────────────────────────────

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event MinterUpdated(address indexed minter, bool status);
    event RewardMinted(address indexed to, uint256 amount, string reason);

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        minters[msg.sender] = true;

        // Mint initial supply to owner: 1,000,000 SST
        _mint(msg.sender, 1_000_000 * 10 ** 18);
    }

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "SST: not owner");
        _;
    }

    modifier onlyMinter() {
        require(minters[msg.sender], "SST: not a minter");
        _;
    }

    // ─── ERC-20 Core ──────────────────────────────────────────────────────────

    function transfer(address _to, uint256 _value) external returns (bool) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) external returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(allowance[_from][msg.sender] >= _value, "SST: allowance exceeded");
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    // ─── Minting ──────────────────────────────────────────────────────────────

    function mint(address _to, uint256 _amount) external onlyMinter {
        _mint(_to, _amount);
    }

    function mintScanReward(address _to) external onlyMinter {
        _mint(_to, scanReward);
        emit RewardMinted(_to, scanReward, "Product scan verified");
    }

    function mintJourneyReward(address _to) external onlyMinter {
        _mint(_to, journeyReward);
        emit RewardMinted(_to, journeyReward, "Journey step recorded");
    }

    function mintRegistrationReward(address _to) external onlyMinter {
        _mint(_to, registrationReward);
        emit RewardMinted(_to, registrationReward, "Product registered");
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setMinter(address _minter, bool _status) external onlyOwner {
        minters[_minter] = _status;
        emit MinterUpdated(_minter, _status);
    }

    function updateRewards(
        uint256 _scanReward,
        uint256 _journeyReward,
        uint256 _registrationReward
    ) external onlyOwner {
        scanReward         = _scanReward;
        journeyReward      = _journeyReward;
        registrationReward = _registrationReward;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "SST: zero address");
        owner = _newOwner;
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0), "SST: transfer to zero address");
        require(balanceOf[_from] >= _value, "SST: insufficient balance");
        balanceOf[_from] -= _value;
        balanceOf[_to]   += _value;
        emit Transfer(_from, _to, _value);
    }

    function _mint(address _to, uint256 _amount) internal {
        require(_to != address(0), "SST: mint to zero address");
        totalSupply      += _amount;
        balanceOf[_to]   += _amount;
        emit Transfer(address(0), _to, _amount);
    }
}
