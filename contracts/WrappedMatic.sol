// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

    function totalSupply() external view returns(uint);
    function balanceOf(address _account) external view returns(uint);
    function transfer(address _to, uint _amount) external returns(bool);
    function allowance(address _owner, address _spender) external view returns(uint);
    function approve(address _spender, uint _amount) external returns(bool);
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) external returns(bool);
}

interface IERC20Metadata is IERC20 {
    function name() external view returns(string memory);
    function symbol() external view returns(string memory);
    function decimals() external view returns(uint8);
}

interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns(bool);
}

contract ERC20 is IERC20Metadata, IERC165 {
    // from user to his/her balance
    mapping(address => uint) internal balances;
    // from user to approved operator
    mapping(address => mapping(address => uint)) private allowances;

    string private _name;
    string private _symbol;
    uint8 private immutable _decimals;

    uint private _totalSupply;

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _tokenDecimals,
        uint _tokenTotalSupply /// note must be in decimal format
    ) {
        _name = _tokenName;
        _symbol = _tokenSymbol;
        _decimals = _tokenDecimals;
        _totalSupply = _tokenTotalSupply;

        balances[msg.sender] = _tokenTotalSupply;
    }

    function name() external view returns(string memory) {
        return _name;
    }

    function symbol() external view returns(string memory) {
        return _symbol;
    }

    function totalSupply() external view returns(uint) {
        return _totalSupply;
    }

    function decimals() external view returns(uint8) {
        return _decimals;
    }

    function balanceOf(address _account) external view returns(uint) {
        return balances[_account];
    }

    function allowance(address _owner, address _spender) external view returns(uint) {
        return allowances[_owner][_spender];
    }

    function transfer(address _to, uint _amount) external returns(bool) {
        address msgSender = msg.sender;
        require(balances[msgSender] >= _amount, "Insufficient balance");
        require(_to != address(0), "Invalid target address");
        require(_amount > 0, "token == 0");

        balances[msgSender] -= _amount;
        balances[_to] += _amount;

        emit Transfer({
            from: msgSender,
            to: _to,
            value: _amount
        });

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount /// note must be in decimal format
    ) external returns (bool) {
        address msgSender = msg.sender;
        require(allowances[_from][msgSender] >= _amount, "Insufficient approval amount");
        require(_to != address(0), "Invalid target address");
        require(_amount > 0, "token == 0");

        allowances[_from][msgSender] -= _amount;

        balances[_from] -= _amount;
        balances[_to] += _amount;

        emit Transfer({
            from: _from,
            to: _to,
            value: _amount
        });

        return true;
    }

    function approve(address _spender, uint _amount) external returns(bool) {
        require(_spender != address(0), "Invalid spender address");
        require(_amount > 0, "token == 0");
        address msgSender = msg.sender;

        allowances[msgSender][_spender] = _amount;

        emit Approval({
            owner: msgSender,
            spender: _spender,
            value: _amount
        });

        return true;
    }

    function _mint(address _to, uint _amount) internal {
        require(_to != address(0), "Invalid address");
        require(_amount > 0, "Invalid token amount");

        _totalSupply += _amount;

        balances[_to] += _amount;

        emit Transfer({
            from: address(0),
            to: _to,
            value: _amount
        });
    }

    function _burn(address _from, uint _amount) internal {
        require(_amount > 0, "Invalid token amount");

        _totalSupply -= _amount;

        balances[_from] -= _amount;

        emit Transfer({
            from: _from,
            to: address(0),
            value: _amount
        });
    } 

    function supportsInterface(bytes4 _interfaceId) external pure returns(bool) {
        return _interfaceId == type(IERC20).interfaceId || _interfaceId == type(IERC20Metadata).interfaceId;
    }
}

contract WETH is ERC20("Wrapped Ether", "WETH", 18, 0) {
    address public immutable owner = msg.sender;

    mapping(address => bool) private oracleOperators;

    event EtherUnlockingRequest(
        address unlocker,
        uint256 amount,
        uint256 time
    );

    constructor(address[] memory _oracleOperators) {
        for (uint256 i; i < _oracleOperators.length; ++i) {
            require(
                oracleOperators[_oracleOperators[i]] == false,
                "Duplicate operator"
            );

            oracleOperators[_oracleOperators[i]] = true;
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier onlyOperators() {
        require(oracleOperators[msg.sender] == true, "Only operators");
        _;
    }

    function mint(
        uint256 _wether,
        address _to
    ) external onlyOperators {
        _mint(_to, _wether);
    }

    function unlockEther(uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Not enough balance");

        _burn(msg.sender, _amount);

        emit EtherUnlockingRequest({
            unlocker: msg.sender,
            amount: _amount,
            time: block.timestamp
        });
    }

    function addOperator(address _newOperator) external onlyOwner {
        oracleOperators[_newOperator] = true;
    }
}