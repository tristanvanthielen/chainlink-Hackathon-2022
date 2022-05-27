import { SubscriptionsOutlined } from "@mui/icons-material";
import { ethers } from "ethers";
import ItemsConfiguration from "../assets/items/ItemsConfiguration";
import { AnvilContractClient } from "./AnvilContractClient";
import { IInventory, IItemInInventory, IItem } from "./InventoryManager";

export class AnvilContractClientGameWrapper {
    contractClient: AnvilContractClient
    UPGRADE_PERCENTAGE: number = 50

    constructor() {
        this.contractClient = new AnvilContractClient()
    }

    init() {
       // this.contractClient.init()
    }

    async attemptUpgradeItem(address: string, itemId: number) {
        return AnvilContractClient.nonDeterministicUpgradeItem(address, itemId).then((val) => {
            console.log(val)
        })
    }


    async getInventoryForAddress(address: string): Promise<IInventory> {
        const validItemIds = ItemsConfiguration.validItemIds()
        const addresses: string[] = []

        validItemIds.forEach(() => {
            addresses.push(address)
        })

        return AnvilContractClient.balanceOfBatch(addresses, validItemIds).then(async (balances) => {
            //console.log(validItemIds)
            //console.log(balances)
            let itemsInInventory: IItemInInventory[] = []

            await Promise.all(validItemIds.map(async (itemId, i) => {
                const amount = balances[i].toBigInt()
                
                if (amount > 0) {
                    const item: IItem | undefined = await ItemsConfiguration.getItemById(itemId)
                    console.log(item)
                    itemsInInventory.push({
                        item: item,
                        amount: amount
                    })
                }

            }))
            console.log(itemsInInventory)
            return {
                items: itemsInInventory
            }
        })
    }

    subscribeOnForgeOutcome(callback: any, subscriptionId: string | null = null) {
        return AnvilContractClient.subscribeOnReturnedRandomness((randomNumber: ethers.BigNumber) => {
            console.log("Callback GameWrapper")
            const outcomeNumber = randomNumber.toNumber()
            callback(outcomeNumber <= this.UPGRADE_PERCENTAGE)
        }, subscriptionId)
    }
}