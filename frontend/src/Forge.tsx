import { Button, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { IInventory, IItem, IItemInInventory, InventoryManager } from './utils/InventoryManager';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import InventoryItemsOverview from './InventoryItemsOverview';
import { MetamaskAccountContext } from './utils/Context';
import { AnvilContractClientGameWrapper } from './utils/AnvilContractClientGameWrapper';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';

import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';

interface IForgeState {
    inventory: IInventory | undefined
    selectedReagent: IItemInInventory | undefined
    isForging: boolean
    resultModalIsOpen: boolean
    forgingSucceeded: boolean | undefined
}

export default class Forge extends React.Component<{ etherAddress?: string | boolean | null }, IForgeState> {
    static contextType = MetamaskAccountContext
    context!: React.ContextType<typeof MetamaskAccountContext>
    anvilContractClientGameWrapper: AnvilContractClientGameWrapper
    etherAddress: string | boolean | null = null

    modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    constructor(props: any) {
        super(props);
        this.setInternalFromProps = this.setInternalFromProps.bind(this)
        this.setInternalFromProps(props)
        this.anvilContractClientGameWrapper = new AnvilContractClientGameWrapper();
        this.state = {
            inventory: undefined,
            selectedReagent: undefined,
            isForging: false,
            resultModalIsOpen: false,
            forgingSucceeded: undefined
        }
        this.onReagentChange = this.onReagentChange.bind(this)
        this.onForgeButtonClick = this.onForgeButtonClick.bind(this)
        this.onForgingEvent = this.onForgingEvent.bind(this)
        this.onForgingSuccess = this.onForgingSuccess.bind(this)
        this.onForgingFailed = this.onForgingFailed.bind(this)
        this.closeResultModal = this.closeResultModal.bind(this)
        this.openResultModal = this.openResultModal.bind(this)
        this.anvilContractClientGameWrapper.subscribeOnForgeOutcome(this.onForgingEvent, "forge-page_forge_outcome")
    }

    onForgingEvent(outcome: boolean) {
        console.log("Callback Forge")
        console.log(`forge ${outcome}`)
        if (this.state.isForging) {
            this.setState({
                isForging: false
            })

            if (outcome) {
                this.onForgingSuccess()
            } else {
                this.onForgingFailed()
            }
        }
    }

    onForgingSuccess() {
        this.setState({
            isForging: false,
            resultModalIsOpen: true,
            forgingSucceeded: true,
            selectedReagent: undefined
        })
    }

    onForgingFailed() {
        this.setState({
            isForging: false,
            resultModalIsOpen: true,
            forgingSucceeded: false,
            selectedReagent: undefined
        })
    }

    setInternalFromProps(props: any) {
        this.etherAddress = props.etherAddress
    }

    loadInventory() {
        this.anvilContractClientGameWrapper.getInventoryForAddress(this.context.metamaskAccount).then((inventory: IInventory) => {
            this.setState({
                inventory: inventory
            })
        })
    }

    componentWillReceiveProps(nextProps: any) {
        this.setInternalFromProps(nextProps);
        if (this.walletConnected()) {
            this.loadInventory()
        }
    }

    componentDidMount() {
        if (this.walletConnected()) {
            this.loadInventory()
        }
    }

    onClickInventoryItem(item: IItem) {
    }

    openResultModal() {
        this.setState({
            resultModalIsOpen: true
        })
    }

    closeResultModal() {
        this.setState({
            resultModalIsOpen: false
        })
    }

    onReagentChange(e: any, selectedReagent: any) {
        console.log(selectedReagent)
        if (selectedReagent === null) {
            selectedReagent = undefined
        }
        this.setState({
            selectedReagent: selectedReagent
        })
    }

    onForgeButtonClick() {
        if (typeof this.etherAddress === "string" && this.state.selectedReagent !== undefined) {
            this.anvilContractClientGameWrapper.attemptUpgradeItem(this.etherAddress, this.state.selectedReagent?.item.itemId).then((res) => {
                console.log(res)
            })
            this.setState({
                isForging: true
            })
        }
    }

    walletConnected(): boolean {
        return this.context.metamaskAccount !== false
    }

    renderForgingResultModalContent() {
        if (this.state.forgingSucceeded) {
            return "Forging was successful! You can view your new item in your inventory."
        } else {
            return "Forging was unsuccesful... Your items broke during the process."
        }
    }

    renderForgingResultModalTitle() {
        if (this.state.forgingSucceeded) {
            return "Success!"
        } else {
            return "Failure..."
        }
    }

    icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    checkedIcon = <CheckBoxIcon fontSize="small" />;

    render() {
        return <div style={{
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Typography variant="h2" gutterBottom component="div">
                Forge
            </Typography>

            {!this.walletConnected() &&
                <div>
                    <Typography variant='body1' gutterBottom component="div">
                        <div>No wallet connected. Please connect your wallet to view your inventory.{this.context.metamaskAccount}</div>
                    </Typography>
                </div>
            }

            <Modal
                open={this.state.resultModalIsOpen}
                onClose={this.closeResultModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={this.modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {this.renderForgingResultModalTitle()}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {this.renderForgingResultModalContent()}
                    </Typography>
                </Box>
            </Modal>











            {this.state.isForging &&
                <Stack spacing={2} style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div>
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h3" component="div">Forging...</Typography>
                            <LinearProgress sx={{ background: "#261616" }} />
                        </Box>
                    </div>
                </Stack>
            }

            {this.state.inventory !== undefined && this.walletConnected() && !this.state.isForging &&
                <Stack spacing={2} style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div>
                        <Autocomplete
                            id="reagent-seletor"
                            style={{ width: 500, backgroundColor: "#706f6f" }}
                            sx={{ width: 300 }}
                            options={this.state.inventory.items}
                            autoHighlight
                            getOptionLabel={(option) => `${option.item.itemName} (${option.item.itemRarity.rarityClass})`}
                            onChange={this.onReagentChange}
                            renderOption={(props, option) => (
                                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                    <img
                                        loading="lazy"
                                        width="20"
                                        src={option.item.visualAssetPath}
                                        alt=""
                                    />
                                    {`${option.item.itemName} (${option.item.itemRarity.rarityClass})`}
                                </Box>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Choose an item"
                                    inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                    }}
                                />
                            )}
                        />
                    </div>
                    <div><InventoryItemsOverview callBackOnClickItem={null} preloadedInventory={{ items: this.state.selectedReagent === undefined ? [] : [this.state.selectedReagent] }} /></div>
                    <div><Button variant="contained" size="large" onClick={this.onForgeButtonClick} style={{ backgroundColor: "#EFC02A", }}>
                        FORGE
                    </Button></div>
                </Stack>
            }

        </div>
    }


}