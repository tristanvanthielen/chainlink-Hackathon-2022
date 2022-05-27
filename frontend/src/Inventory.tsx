import { Typography } from '@mui/material';
import * as React from 'react';
import InventoryItemsOverview from './InventoryItemsOverview';
import { MetamaskAccountContext } from './utils/Context';

export default class Inventory extends React.Component {

    static contextType = MetamaskAccountContext
    context!: React.ContextType<typeof MetamaskAccountContext>

    constructor(props: any) {
        super(props)
    }

    componentDidMount() {
    }

    walletConnected(): boolean {
        return this.context.metamaskAccount !== false
    }

    render() {
        return <div>
            <Typography variant="h2" gutterBottom component="div">
                Inventory
            </Typography>

            {this.walletConnected() &&
                <div>
                    <InventoryItemsOverview etherAddress={this.context.metamaskAccount} />
                </div>
            }

            {!this.walletConnected() &&
                <div>
                    <Typography variant='body1' gutterBottom component="div">
                    <div>No wallet connected. Please connect your wallet to view your inventory.</div>
                    </Typography>
                </div>
            }
        </div>
    }
}