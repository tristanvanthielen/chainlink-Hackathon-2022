import { Typography } from '@mui/material';
import * as React from 'react';
import ItemCard from './ItemCard';
import {IInventory, IItem, InventoryManager} from './utils/InventoryManager';
import Grid from '@mui/material/Grid';
import { AnvilContractClientGameWrapper } from './utils/AnvilContractClientGameWrapper';
import ItemsConfiguration from './assets/items/ItemsConfiguration'

interface IInventoryItemsOverviewState {
    inventory: IInventory|undefined
}

export default class InventoryItemsOverview extends React.Component<{callBackOnClickItem?: any, preloadedInventory?: IInventory | null, etherAddress?: string | boolean | null}, IInventoryItemsOverviewState> {
    callBackOnClickItem: any = null
    preloadedInventory: IInventory | null = null
    etherAddress: string | null = null
    anvilContractClientGameWrapper: AnvilContractClientGameWrapper

    constructor(props: any) {
        super(props);
        this.anvilContractClientGameWrapper = new AnvilContractClientGameWrapper();
        this.setInternalFromProps = this.setInternalFromProps.bind(this)
        this.setInternalFromProps(props)
        this.onItemClick = this.onItemClick.bind(this)
        this.loadInventory = this.loadInventory.bind(this)
        this.shouldFetchInventory = this.shouldFetchInventory.bind(this)
        this.state = {
            inventory: undefined
        }
    }

    setInternalFromProps(props: any) {
        this.callBackOnClickItem = null || props.callBackOnClickItem;
        this.preloadedInventory = props.preloadedInventory
        this.etherAddress = props.etherAddress
    }

    shouldFetchInventory(): boolean {
        return this.preloadedInventory === null || this.preloadedInventory === undefined
    }

    loadInventory() {
        if (this.shouldFetchInventory()) {
            if (this.etherAddress !== null) {
                this.anvilContractClientGameWrapper.getInventoryForAddress(this.etherAddress).then((inventory: IInventory) => {
                    console.log(inventory)
                    this.setState({
                        inventory: inventory
                    })
                })


               // this.anvilContractClientGameWrapper.attemptUpgradeItem(this.etherAddress, 0).then()
            } else {
                console.error("Ether address should be provided to fetch inventory from chain.")
            }
        } else {
            this.setState({
                inventory: this.preloadedInventory!
            })

            if (this.preloadedInventory !== null && this.preloadedInventory.items.length > 0) {
                this.preloadedInventory.items[0].amount = BigInt(10)
            }
        }
    }
    
    componentDidMount() {
        if (this.shouldFetchInventory()) {
            this.anvilContractClientGameWrapper.init()
        }
        this.loadInventory();
    }

    componentWillReceiveProps(nextProps: any) {
        this.setInternalFromProps(nextProps);
        this.loadInventory();
    }

    onItemClick(item: IItem) {
        if (this.callBackOnClickItem !== null && this.callBackOnClickItem !== undefined) {
            this.callBackOnClickItem(item)
        }
    }

    render() {
        return  <Grid sx={{ flexGrow: 0 }} container spacing={2}>
        <Grid item xs={15}>
          <Grid container justifyContent="left" spacing={2}>
            {this.state.inventory?.items.map((inventoryItem, i) => (
              <Grid key={i} item>
                <ItemCard item={inventoryItem.item} callBackOnClick={this.onItemClick}></ItemCard>
                <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 500,
                  letterSpacing: '.1rem',
                  color: "inherit",
                  textDecoration: 'none',
                }}
              >
                x{inventoryItem.amount.toString()}
              </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    }
}