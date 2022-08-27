// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// at: 0xD568d4d4723dB7D0f5c97B27d29d73be69353ceF


contract BuyMeACoffee {
    // Event to emit when a Memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Address of contract deployer. Marked payable so that
    // we can widthdraw to this address later.
    address payable owner;

    // List of all memos received from coffee purchases.
    Memo[] memos;

    constructor() {
        // Store the address of the deployer as a payable address.
        // When we withdraw found, we'll withdraw here.
        owner = payable(msg.sender);
    }

    /**
     * @dev fetches all stored memos
     */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }

    /**
     * @dev buy a coffee for owner (send ETH tip and leaves a memo).
     * @param _name name of the coffee purchaser.
     * @param _message a nice message from the purcheser.
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        // Must accept more that 0 ETH for a coffee
        require(msg.value > 0, "Can't buy coffee for free!");

        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // Emit a NewMemo event with detail about the memo.
        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     * address(this).balance fetches the ether stored on the contract.
     * owner.send(...) is the syntax for creating a send transaction with ether.
     * require(...) statement that wraps everything is there to ensure that if there are any issues, 
     * the transaction is reverted and nothing is lost.
     */
    function withDrawTips() public {
        require(owner.send(address(this).balance));
    }

}
