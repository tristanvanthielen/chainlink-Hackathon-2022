import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Logo from './Logo';
import { connectWallet } from './utils//MetamaskConnect';
import { MetamaskAccountContext } from './utils/Context';
import { green, red } from '@mui/material/colors';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Link } from 'react-router-dom';

const pages = [
  /*
  {
    "caption": "Play now",
    "link": "/game"
  },
  */
  {
    "caption": "Inventory",
    "link": "/inventory"
  },
  {
    "caption": "Forge",
    "link": "/forge"
  },
]

const appName: string = "ANVIL"

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { metamaskAccount, setMetamaskAccount } = React.useContext(MetamaskAccountContext);

  const connectMetamaskAccount = () => {
    handleCloseUserMenu();
    connectWallet().then(wallet => {
      setMetamaskAccount(wallet);
    })
  }

  const disconnectMetamaskAccount = () => {
    handleCloseUserMenu();
    setMetamaskAccount(false)
  }

  const metamaskConnected = () => {
    return metamaskAccount !== false
  }

  const walletAddressAbbreviated = () => {
    const showN = 5;
    const firstFive = metamaskAccount.substring(0, showN)
    const lastFive = metamaskAccount.substring(metamaskAccount.length - showN)

    return `${firstFive}...${lastFive}`
  }

  const menuItemColor: string = "#EFC02A"
  const appNameColor: string = menuItemColor

  return (
    <AppBar position="static" style={{ background: "#261616" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div style={{ marginRight: 10 }}><Logo /></div>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: "inherit",
              textDecoration: 'none',
            }}
          >
            {appName}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} style={{ backgroundColor: "#261616" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted

              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={`menu-item-${page.caption}`} onClick={handleCloseNavMenu} style={{ backgroundColor: "#261616" }}>
                  <Link key={`menu-item-link-${page.caption}`} to={page.link} style={{ textDecoration: 'none' }}>
                    <Typography key={`menu-item-typography-${page.caption}`} textAlign="center" color={menuItemColor}>{page.caption}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {appName}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link to={page.link} style={{ textDecoration: 'none' }}>

                <Button
                  key={page.caption}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: menuItemColor, display: 'block' }}
                >
                  {page.caption}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {metamaskConnected() &&
              <Typography
                variant="caption"
                
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 500,
                  letterSpacing: '.1rem',
                  color: "inherit",
                  textDecoration: 'none',
                  marginRight: 2
                }}
              >
                {walletAddressAbbreviated()}
              </Typography>

            }
            <Tooltip title="Your wallet">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: metamaskConnected() ? green[500] : red[500] }} alt="Metamask profile">
                  <AccountBalanceWalletIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!metamaskConnected() &&
                <MenuItem key="metamask-connect" onClick={connectMetamaskAccount}>
                  <Typography textAlign="center">Connect Metamask</Typography>
                </MenuItem>
              }
              {metamaskConnected() &&
                <MenuItem key="metamask-disconnectconnect" onClick={disconnectMetamaskAccount}>
                  <Typography textAlign="center">Disconnect Metamask</Typography>
                </MenuItem>
              }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
