# Anvil
## A Chainlink Hackathon 2022 Project

# Concept
Upgrading game items always feels like a risk. Is the game server honest or am I just burning my items? With Anvil, using Chainlink VRF and in-game items as NFTs, gamers finally are guaranteed of the honesty of their upgrade chances. Using EVM for cross-chain compatibility of the framework, so game developers can build in a variety of ecosystems.

## Quick start

Use Brownie to test and deploy Anvil local or on Rinkeby testnet.

**Local**:


`brownie test`

**Rinkeby**:

Setup .env:
export PRIVATE_KEY={METAMASK_ACCOUNT_KEY}
export WEB3_INFURA_PROJECT_ID={INFURA_PROJECT_ID}
export FUND_AMOUNT=0 or more depending on if you already funded the subscription

Testing:
`brownie test --network rinkeby`

Deploy:
`brownie run scripts/vrf_scripts/01_deploy_vrf_consumer.py --network rinkeby`
