import time
import pytest
from brownie import Anvil, convert, network, config
from scripts.helpful_scripts import (
    get_account,
    get_contract,
    LOCAL_BLOCKCHAIN_ENVIRONMENTS,
    listen_for_event,
)

from scripts.vrf_scripts.create_subscription import (
    create_subscription,
    fund_subscription,
)


def test_can_request_random_number():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    # Arrange
    account = get_account()
    subscription_id = create_subscription()
    fund_subscription(subscription_id=subscription_id)
    gas_lane = config["networks"][network.show_active()]["gas_lane"]  # Also known as keyhash
    vrf_coordinator = get_contract("vrf_coordinator")
    link_token = get_contract("link_token")
    vrf_consumer = Anvil.deploy(
        subscription_id,
        vrf_coordinator,
        link_token,
        gas_lane,  # Also known as keyhash
        {"from": account},
    )

    # Act
    tx = vrf_consumer.requestRandomWords({"from": account})
    tx.wait(1)
    request_id = tx.events[0]["requestId"]
    assert isinstance(request_id, int)


def test_transfer_items():
    account = get_account()
    user_account = get_account(index=1)
    subscription_id = create_subscription()
    fund_subscription(subscription_id=subscription_id)
    gas_lane = config["networks"][network.show_active()]["gas_lane"]
    vrf_coordinator = get_contract("vrf_coordinator")
    link_token = get_contract("link_token")
    anvil = Anvil.deploy(
        subscription_id,
        vrf_coordinator,
        link_token,
        gas_lane,
        {"from": account},
    )
    assert anvil.balanceOf(user_account, 0) == 0
    anvil.safeTransferFrom(account, user_account, 0, 10, "0x0")
    assert anvil.balanceOf(user_account, 0) == 10


def test_returns_random_upgrade_local():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing")
    # Arrange
    account = get_account()
    user_account = get_account(index=1)
    subscription_id = create_subscription()
    fund_subscription(subscription_id=subscription_id)
    gas_lane = config["networks"][network.show_active()]["gas_lane"]
    vrf_coordinator = get_contract("vrf_coordinator")
    link_token = get_contract("link_token")
    anvil = Anvil.deploy(
        subscription_id,
        vrf_coordinator,
        link_token,
        gas_lane,
        {"from": account},
    )

    assert anvil.balanceOf(user_account, 0) == 0
    anvil.safeTransferFrom(account, user_account, 0, 10, "0x0")
    assert anvil.balanceOf(user_account, 0) == 10

    # Act
    tx = anvil.nonDeterministicUpgradeItem(user_account, 0, {"from": user_account})
    tx.wait(1)
    request_id = tx.events[0]["requestId"]
    vrf_coordinator.fulfillRandomWords(request_id, anvil.address, {"from": get_account()})

    # Assert
    assert anvil.balanceOf(user_account, 0) == 0
    upgradedItemCount = anvil.balanceOf(user_account, 1)
    print(f"Random Number: {anvil._randomNumber()}")
    print(f"Upgraded Item Count: {upgradedItemCount}")
    assert 0 <= upgradedItemCount <= 1


def test_transfer_items_testnet():
    # Arrange
    if network.show_active() not in ["rinkeby"]:
        pytest.skip("Only for testnet testing")
    # Arrange
    account = get_account()
    user_account = get_account(index=1)
    subscription_id = create_subscription()
    fund_subscription(subscription_id=subscription_id)
    gas_lane = config["networks"][network.show_active()]["gas_lane"]
    vrf_coordinator = get_contract("vrf_coordinator")
    link_token = get_contract("link_token")
    anvil = Anvil.deploy(
        subscription_id,
        vrf_coordinator,
        link_token,
        gas_lane,
        {"from": account},
    )
    assert anvil.balanceOf(user_account, 0) == 0
    anvil.safeTransferFrom(account, user_account, 0, 10, "0x0")
    assert anvil.balanceOf(user_account, 0) == 10
