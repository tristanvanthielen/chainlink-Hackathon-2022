import { Typography } from '@mui/material';
import * as React from 'react';
import {IItem} from './utils/InventoryManager';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default class ItemCard extends React.Component<{item: IItem, callBackOnClick: any}, {}> {
    item: IItem
    callBackOnClick: any = null;

    constructor(props: any) {
        super(props);
        this.item = props.item
        this.callBackOnClick = props.callBackOnClick
        this.onItemClick = this.onItemClick.bind(this);
    }
    
    componentDidMount() {
      console.log(this.item)
    }

    onItemClick() {
      if (this.callBackOnClick != null && this.callBackOnClick !== undefined) {
        this.callBackOnClick(this.item)
      }
    }

    render() {
        return <Card sx={{ display: 'block'}} onClick={this.onItemClick}>
        <Box sx={{ display: 'block',  backgroundColor:  "#706f6f"}}>
          <CardContent sx={{ backgroundColor:  "#706f6f" }}>
            <Typography component="div" variant="h5">
              {this.item.itemName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" component="div">
              {this.item.itemRarity.rarityClass}
            </Typography>
          </CardContent>
          <img style={{width: 100, height: 100}} src={this.item.visualAssetPath} />
        </Box>
      </Card>
    }
}