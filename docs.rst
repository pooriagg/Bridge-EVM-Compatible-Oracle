=======================
Bridge Oracle Documents
=======================

In this example, we will lock Matic in the polygon (layer 2) and mint Wrapped-Matic in the ethereum blockchain (layer 1).

.. code-block:: solidity

    interface IOracle {
        function lockEther() external payable;
    }

    interface IWether {
        function unlockEther(uint256 _amount) external;
    }

Lock Matic
===============

.. code-block:: solidity

    function lockEther() external payable;

Will lock your matic in the smart contract (oracle) and an equal amount of that coin will minted in the destination chain (ethereum in this example). 1 Matic == 1 Wrapped-Matic

Unlock Matic
================

    function unlockEther(uint256 _amount) external;

Will burn Wrapped-Matic to unlock, locked amount ``_amount`` of Matic in the polygon chain.

----------
Parameters
----------

1. ``_amount`` - ``uint256``: Amount of Wrapped-Matic user wishes to burn which leads to unlocking this amount of Matic coin in the polygon network.
