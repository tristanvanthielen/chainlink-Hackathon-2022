//SPDX-License-Identifier: MIT

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";



// This is the main building block for smart contracts.
contract Anvil is ERC1155 {
    uint256 public constant COMMON = 0;
    uint256 public constant UNCOMMON = 1;
    uint256 public constant RARE = 2;
    uint256 public constant LEGENDARY = 3;

    uint256 public constant startingCommonCount = 10**27;
    uint256 public constant startingUncommonCount = 10**18;
    uint256 public constant startingRareCount = 10**9;
    uint256 public constant startingLegendaryCount = 1;

    uint256 public constant UPGRADE_FACTOR = 10;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    /**
     * Contract initialization.
     *
     * The `constructor` is executed only once when the contract is created.
     * The `public` modifier makes a function callable from outside the contract.
     */
    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        owner = msg.sender;
        _mint(msg.sender, COMMON, startingCommonCount, "");
        _mint(msg.sender, UNCOMMON, startingUncommonCount, "");
        _mint(msg.sender, RARE, startingRareCount, "");
        _mint(msg.sender, LEGENDARY, startingLegendaryCount, "");
    }

    function deterministicUpgradeItem(address from, uint256 id) external {
        // We can print messages and values using console.log
        console.log(
            "Upgrading from %s items of rarity %s to 1 item of type %s",
            UPGRADE_FACTOR,
            id,
            id+1
        );
        
        uint256 newId = id+1;
        // Transfer the amount.
        _burn(from, id, 10);
        _mint(from, newId, 1, "");
    }

}
