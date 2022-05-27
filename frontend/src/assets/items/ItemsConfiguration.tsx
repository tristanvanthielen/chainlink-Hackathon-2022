import { IItem, IItemCategory, ItemRarityClass } from "../../utils/InventoryManager"

interface IIPFSItemProperties {
    defence: string
    attack: string
    rarity: string
}

interface IIPFSItemMetadata {
    name: string
    description: string
    image: string
    properties: IIPFSItemProperties
}

export default class ItemsConfiguration {
    static ITEM_ID_TO_ITEM: Map<number, IItem> = new Map<number, IItem>();
    static IPFS_ITEM_METADATA_HOST: string = "https://bafybeic7s5niqxx477qr62tuybucbazhjp3fmdqyd567n5byy6hlomooyi.ipfs.nftstorage.link"

    static crossbowItemCategory: IItemCategory = {
        name: "Crossbow"
    }

    static swordItemCategory: IItemCategory = {
        name: "Sword"
    }

    static daggerItemCategory: IItemCategory = {
        name: "Dagger"
    }

    static VALID_ITEM_IDS: number[] = [
        0, 1, 2, 3, 
        10, 11, 12, 13, 
        20, 21, 22, 23
    ]

    static ITEMS: IItem[] = []

    static {
        this.ITEMS.forEach((item) => {
            this.ITEM_ID_TO_ITEM.set(item.itemId, item)
        })
    }
    
    static rarityClassStringToEnum(rarity: string): ItemRarityClass | undefined {
        return {
            "COMMON": ItemRarityClass.COMMON,
            "UNCOMMON": ItemRarityClass.UNCOMMON,
            "RARE": ItemRarityClass.RARE,
            "LEGENDARY": ItemRarityClass.LEGENDARY
        }[rarity]
    }

    static async getItemMetadataFromIPFS(itemId: number): Promise<IIPFSItemMetadata> {
        const ipfsResource: string = `${this.IPFS_ITEM_METADATA_HOST}/${itemId}.json`
        const response = await fetch(ipfsResource, {method: 'GET'})

        if (!response.ok) {
            throw new Error(`"Could not get Item metadata from IPFS: ${ipfsResource}"`)
        }
        const result = (await response.json())
        return result
    }

    static IPFSMetadataToItem(itemId: number, metadata: IIPFSItemMetadata): IItem {
        let metadataName = metadata.name
        let parts = metadataName.split("_")
        let itemName = parts[0]
        let itemCategory = parts[0]
        return {
            itemId: itemId,
            itemName: itemName,
            itemDescription: metadata.description,
            itemCategory: {name: itemCategory},
            itemRarity: {
                rarityClass: metadata.properties.rarity
            },
            itemProperties: {
                defence: parseInt(metadata.properties.defence),
                attack: parseInt(metadata.properties.attack)
            },
            visualAssetPath: metadata.image
        }
    }

    static async getItemById(itemId: number): Promise<IItem> {
        const metadataFromIPFS: IIPFSItemMetadata = await this.getItemMetadataFromIPFS(itemId)
        return this.IPFSMetadataToItem(itemId, metadataFromIPFS)
    }

    static validItemIds(): number[] {
        return this.VALID_ITEM_IDS
    }
}