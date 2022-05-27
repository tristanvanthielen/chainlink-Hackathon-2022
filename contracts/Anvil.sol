//SPDX-License-Identifier: MIT

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";




// This is the main building block for smart contracts.
contract Anvil is ERC1155, VRFConsumerBaseV2 {

    struct UpgradeRequest {
        //the player requesting the upgrade
        address player;
        //the ID of the item requested to be upgraded
        uint256 itemId;
    }

    mapping(uint256 => UpgradeRequest) upgradeRequests;

    /**********
    **
    ** Anvil values
    **
    **********/

    uint256 public constant DAGGER_COMMON = 0;
    uint256 public constant DAGGER_UNCOMMON = 1;
    uint256 public constant DAGGER_RARE = 2;
    uint256 public constant DAGGER_LEGENDARY = 3;

    uint256 public constant SWORD_COMMON = 10;
    uint256 public constant SWORD_UNCOMMON = 11;
    uint256 public constant SWORD_RARE = 12;
    uint256 public constant SWORD_LEGENDARY = 13;

    uint256 public constant CROSSBOW_COMMON = 20;
    uint256 public constant CROSSBOW_UNCOMMON = 21;
    uint256 public constant CROSSBOW_RARE = 22;
    uint256 public constant CROSSBOW_LEGENDARY = 23;


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
    VRFCoordinatorV2Interface immutable COORDINATOR;
    LinkTokenInterface immutable LINKTOKEN;
    uint64 s_subscriptionId;
    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    bytes32 immutable s_keyHash;
    uint32 immutable s_callbackGasLimit = 100000;    uint16 requestConfirmations = 3;
    uint32 immutable s_numWords = 2;
    uint256 public _randomNumber;
    uint16 immutable s_requestConfirmations = 3;
    address s_owner;

    event ReturnedRandomness(uint256 randomNumber);


    constructor(
        uint64 subscriptionId,
        address vrfCoordinator,
        address link,
        bytes32 keyHash
    ) ERC1155("https://bafybeic7s5niqxx477qr62tuybucbazhjp3fmdqyd567n5byy6hlomooyi.ipfs.nftstorage.link/{id}.json")
        VRFConsumerBaseV2(vrfCoordinator){

        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_keyHash = keyHash;
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;

        //old
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
    function nonDeterministicUpgradeItem(address from,uint256 itemId) external returns (uint256 requestId)  {
        require(
           from == _msgSender() || isApprovedForAll(from, _msgSender()),
           "Anvil: caller is not owner nor approved"
        );
        //TODO check there's actually 10 items of the one requested to being upgraded
        //require(balanceOf(from,itemId) >= 10, "Anvil: caller does not have enough tokens");

        //Ensure Item is upgradable
        //0 common - 1 uncommon - 2 rare - 3 legendary. Mod 10 to get rank
        require(itemId % 10 < 3 , "Anvil: Cannot upgrade legendary item");


        //trigger Chainlink to get a random percentage for this request
        requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            s_requestConfirmations,
            s_callbackGasLimit,
            s_numWords
        );
        //push the request on the stack
        upgradeRequests[requestId] = UpgradeRequest(
            msg.sender,
            itemId
            );

    }

    //todo ensure requestId is mapped to user + upgrading request. atm only 1 for testing.
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {

        UpgradeRequest storage u = upgradeRequests[requestId];


        //burn `UPGRADE_FACTOR` amount, no matter what
        _burn(u.player, u.itemId, UPGRADE_FACTOR);


        //number ends up between 1-100, use as percentage. 80% change means number between 1-80.
        _randomNumber = (randomWords[0] % 100) + 1;
        if (_randomNumber <= UPGRADE_PERCENTAGE) {
            _mint(u.player, u.itemId+1, 1, "");
        }

        emit ReturnedRandomness(_randomNumber);
    }

    modifier onlyOwner() {
    require(msg.sender == s_owner);
    _;
  }
}
