#!/usr/bin/python3
from brownie import Anvil
from scripts.helpful_scripts import get_account


def main():
    account = get_account()
    vrf_contract = Anvil[-1]
    try:
        tx = vrf_contract.requestRandomWords({"from": account})
        tx.wait(1)
    except:
        print(
            "Remember to fund your subscription! \n You can do it with the scripts here, or at https://vrf.chain.link/"
        )
    print("Requested!")
