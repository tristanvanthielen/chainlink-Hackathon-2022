//SPDX-License-Identifier: MIT

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

// We import this library to be able to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";



// This is the main building block for smart contracts.
contract Anvil is ERC1155, VRFConsumerBaseV2 {

    /**********
    ** 
    ** Anvil values
    ** 
    **********/
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
    uint256 public constant UPGRADE_PERCENTAGE = 50;
    //uint256 public constant uncommonUpgradeProbababilty = 0.5;
    //uint256 public constant rareUpgradeProbababilty  = 0.25;
    //uint256 public constant legendaryUpgradeProbababilty  = 0.05;

    //the amount of items of type {id} needed to attempt an upgrade to {id+1}.
    uint256 public constant UPGRADE_FACTOR = 10;

    address public owner;


    /**********
    ** 
    ** Chainlink values
    ** 
    **********/
    VRFCoordinatorV2Interface COORDINATOR;

    bytes32 public keyHash;
    uint256 public fee;
    uint256 public _randomNumber;
    uint256 public _requestId;
    uint64 _subscriptionId;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 1;
    address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab; // Rinkeby
    address linkTokenAddress = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;  // Rinkeby - not needed in V2?

    constructor()   ERC1155("https://game.example/api/item/{id}.json")
                    VRFConsumerBaseV2(vrfCoordinator){

        /** CHAINLINK INIT **/
        //not sure why not declare static above, tutorial does it like this
        keyHash = 0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        _subscriptionId = 4720;
        fee = 0.1*10**18; // fee of 0.1 LINK

        owner = msg.sender;

        /** ERC1155 INIT **/
        _mint(msg.sender, CROSSBOW_COMMON, startingCommonCount, "");
        _mint(msg.sender, SWORD_COMMON, startingCommonCount, "");
        _mint(msg.sender, DAGGER_COMMON, startingCommonCount, "");
    }


    /**
     * @dev Destroys `UPGRADE_FACTOR` tokens of token type `id` from `from` and has `UPGRADE_PERCENTAGE` chance of minting token `id+1`
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

    //TODO check multiple - https://docs.chain.link/docs/chainlink-vrf-best-practices/#processing-simultaneous-vrf-requests
    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() external onlyOwner {
        // Will revert if subscription is not set and funded.

        //TODO map requestId to the user + the upgrade he wants to do.
        _requestId = COORDINATOR.requestRandomWords(
        keyHash,
        _subscriptionId,
        requestConfirmations,
        callbackGasLimit,
        1 //numWords
        );
    }

    //todo ensure requestId is mapped to user + upgrading request. atm only 1 for testing.
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        //number ends up between 1-100, used as percentage
        _randomNumber = (randomWords[0] % 100) + 1;
        console.log("random number is %s for requestId %s",_randomNumber, requestId);
        if (_randomNumber <= UPGRADE_PERCENTAGE){
            console.log("Yakshemash. upgraded your item!");
        }
        else{
            console.log("sad story. Burnt your item.. Better luck next time");
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
