import * as fs from 'fs';
import mockInventoryDries from '../assets/inventories/dries.json';

export enum ItemRarityClass {
    COMMON = "COMMON",
    UNCOMMON = "UNCOMMON",
    RARE = "RARE",
    LEGENDARY = "LEGENDARY"
}

export interface IItemRarity {
    rarityClass: string
}

export interface IItemProperties {
    defence: number
    attack: number
}

export interface IItemCategory {
    name: string
}

export interface IItem {
    itemId: number
    itemName: string
    itemDescription: string
    itemCategory: IItemCategory
    itemRarity: IItemRarity
    itemProperties: IItemProperties
    visualAssetPath: string
}

export interface IItemInInventory {
    item: IItem
    amount: bigint
}

export interface IInventory {
    items: IItemInInventory[]
}

export class InventoryManager {
    static getInventoryForWallet(walletAddress: string): IInventory|undefined {
        const items: IItemInInventory[] = []

        return {
            items: items
        }
    }
}