import AnvilContractABI from '../assets/abi/Anvil.json'
import * as React from 'react';
import {ethers} from 'ethers'
import { IInventory } from './InventoryManager';
const { ethereum } = window;

export class AnvilContractClient {
    static ANVIL_CONTRACT_ADDRESS: string = "0x8eAD02758Afa6409e8508db8bAF9162588c5D572";
    static provider: any = null;
    static signer: any = null;
    static contract: any = null;
    static subscribedIds: string[] = [];

    constructor() {

    }

    static {

    }

    static initIfNotInited() {
        if (this.provider === null || this.signer === null || this.contract === null) {
            this.loadProvider();
            this.loadSigner();
            this.loadContract();
        }
    }

    init() {
        /*
        this.loadProvider();
        this.loadSigner();
        this.loadContract();
        console.log(this.contract)
        */
    }

    static loadProvider() {
        this.provider = new ethers.providers.Web3Provider(window.ethereum)
    }

    static loadSigner() {
        if (this.provider !== null) {
            this.signer = this.provider.getSigner()
        }
    }

    static loadContract() {
        if (this.signer !== null) {
            const contractInterface: ethers.utils.Interface = new ethers.utils.Interface(AnvilContractABI["abi"])
            this.contract = new ethers.Contract(this.ANVIL_CONTRACT_ADDRESS, contractInterface, this.signer)
            console.log(this.contract)
        }
    }

    static async balanceOfBatch(addresses: string[], ids: number[]): Promise<ethers.BigNumber[]> {
        this.initIfNotInited()
        return this.contract.balanceOfBatch(addresses, ids)
    }

    static async nonDeterministicUpgradeItem(address: string, itemId: number): Promise<any> {
        this.initIfNotInited()
        return this.contract.nonDeterministicUpgradeItem(address, itemId, {
            from: address,
            gasLimit: 200000
        })
    }

    static subscribe(event: string, callback: any) {
        this.contract.on(event, callback)
    }

    static subscribeOnReturnedRandomness(callback: any, subscriptionId: string | null = null) {
        this.initIfNotInited()
        this.subscribe("ReturnedRandomness", callback)
    } 

}
