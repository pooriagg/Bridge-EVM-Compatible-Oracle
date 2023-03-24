// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.17;

contract Oracle {
    address public immutable owner = msg.sender;

    mapping(address => bool) private oracleOperators;
    mapping(address => uint256) public etherToUnlock;

    event EtherLockingRequest(
        address locker,
        uint256 amount,
        uint256 time
    );

    event EtherWithdraw(
        address withdrawer,
        uint256 amount,
        uint256 time
    );

    event EtherIncreased(
        address to,
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

    bool locked;
    modifier reentrantGaurd() {
        require(locked == false, "Locked");
        locked = true;
        _;
        locked = false;
    }

    function lockEther() external payable {
        require(msg.value >= 0.01 ether, "insufficient fund");

        emit EtherLockingRequest({
            locker: msg.sender,
            amount: msg.value,
            time: block.timestamp
        });
    }

    function increaseEtherToUnlock(
        address _to,
        uint256 _amount 
    ) external onlyOperators {
        etherToUnlock[_to] += _amount;

        emit EtherIncreased({
            to: _to,
            amount: _amount,
            time: block.timestamp
        });
    }

    function unlockEther(uint256 _amount) external reentrantGaurd {
        require(etherToUnlock[msg.sender] >= _amount, "Not enough fund");

        etherToUnlock[msg.sender] -= _amount;

        payable(msg.sender).transfer(_amount);

        emit EtherWithdraw({
            withdrawer: msg.sender,
            amount: _amount,
            time: block.timestamp
        });
    }

    function addOperator(address _newOperator) external onlyOwner {
        oracleOperators[_newOperator] = true;
    }
}