//SPDX-License-Identifier: MIT

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";



// This is the main building block for smart contracts.
contract Anvil is ERC1155 {
    uint256 public constant CROSSBOW_COMMON = 0;
    uint256 public constant CROSSBOW_UNCOMMON = 1;
    uint256 public constant CROSSBOW_RARE = 2;
    uint256 public constant CROSSBOW_LEGENDARY = 3;

    uint256 public constant SWORD_COMMON = 10;
    uint256 public constant SWORD_UNCOMMON = 11;
    uint256 public constant SWORD_RARE = 12;
    uint256 public constant SWORD_LEGENDARY = 13;

    uint256 public constant DAGGER_COMMON = 20;
    uint256 public constant DAGGER_UNCOMMON = 21;
    uint256 public constant DAGGER_RARE = 22;
    uint256 public constant DAGGER_LEGENDARY = 23;

    //everyone starts with Common. No pre-mine of high-quality items
    uint256 public constant startingCommonCount = 10**27;

    //the probability for a successful upgrade
    uint256 public constant uncommonUpgradeProbababilty = 0.5;
    uint256 public constant rareUpgradeProbababilty  = 0.25;
    uint256 public constant legendaryUpgradeProbababilty  = 0.05;

    //the amount of items of type {id} needed to attempt an upgrade to {id+1}.
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
    }


    /**
     * @dev Destroys `UPGRADE_FACTOR` tokens of token type `id` from `from` and has `MINT_PERCENTAGE` chance of minting token `id+1`
     *
     * Emits a {???????? -- check if we need} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `from` must have at least `amount` tokens of token type `id`.
     * TODO implement approval
     */
    function deterministicUpgradeItem(address from,uint256 id) external {
        require(
           from == _msgSender() || isApprovedForAll(from, _msgSender()),
           "Anvil: caller is not owner nor approved"
        );
        //0 common - 1 uncommon - 2 rare - 3 legendary. Mod 10 to get rank
        require(id % 10 < 3 , "Anvil: Cannot upgrade legendary item");

        // We can print messages and values using console.log
        console.log(
            "Requesting VRF percentage for upgrading from %s items of rarity %s to 1 item of type %s",
            UPGRADE_FACTOR,
            id,
            id+1
        );
        
        uint256 newId = id+1;
        // Transfer the amount.
        _burn(msg.sender, id, UPGRADE_FACTOR);
        _mint(msg.sender, newId, 1, "");
    }

}
