/** 

=========================================================
* Vision UI PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Visionware.

*/
import * as React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Backdrop from '@mui/material/Backdrop';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Box from '@mui/material/Box';
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";

// Vision UI Dashboard PRO React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

import 'assets/index.css';
import 'assets/custom.css';


import { ReactComponent as XLauncherLogo } from "assets/images/logo.svg";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarDesktopMenu,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Vision UI Dashboard PRO React context
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Images
import team2 from "assets/images/team-2.jpg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";

//Elrond
import { DappProvider, DappUI, logout, useGetAccountInfo, useGetPendingTransactions } from '@elrondnetwork/dapp-core';
import { Typography } from '@mui/material';
import xConfigs from 'configs/envConfig.json';
import Slider from "@mui/material/Slider";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 5,
  bgcolor: 'rgba(6,11,40,0.94)',
  borderRadius: "25px",
  p: 4
};

function calc2(theform) {
  var with2Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  var value = with2Decimals;
  return value;
}

function DashboardNavbar({ absolute, light, isMini }) {
  
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const transB = useGetPendingTransactions().hasPendingTransactions; 

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  //Config Variables
  let xProvider = xConfigs['provider'];
  let xToken = xConfigs["token"];
  let xStakeAddress = xConfigs["stakeAddress"];
  let xApiLink = xConfigs["apiLink"];
  let xApiResponse = xConfigs["apiResponse"];
  let xPresaleAddress = xConfigs["presaleAddress"];
  let xOldStakeAddress = xConfigs["oldStakeAddress"];

  //Elrond login
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const [timeToConnect, setTimeToConnect] = React.useState(false);

  const { 
    WebWalletLoginButton, 
    WalletConnectLoginButton,
    LedgerLoginButton,
    ExtensionLoginButton
  } = DappUI;

  //Get Account Balance
  const [balanceAccount, setBalanceAccount] = useState([]); 
  const customApi = xApiLink+address+'/tokens/'+xToken;

  const getBalanceAccount = async () => {
      try {
      const response = await fetch(customApi, { 
          headers: {
              'Accept': 'application/json',
          }
      });
      const json = await response.json();
      setBalanceAccount(json.balance);
      } catch (error) {
      console.error(error);
      }
  }

  let balance = balanceAccount/1000000000000000000;
  if(!balance){
    balance = 0;
  }
  var balanceXLH = calc2(balance);

  //Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(isLoggedIn) {
      getBalanceAccount();
      //console.log("balanceAccount " + balanceAccount);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if(isLoggedIn) {
      getBalanceAccount();
    }
  }, [transB]);

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  };

  const openInSameTab = (url) => {
    const newWindow = window.open(url, '_self', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  };

  let connectSection = timeToConnect ? (
    <React.Fragment>
    <Grid container alignContent={'center'} mt={4} mb={4}>
        <Grid item xs={12} sm={12} md={4} lg={4}>

        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={4}>            
          <Box className="farm-card">          
            <Grid container align={'center'}>  
              <Grid item xs={12}>
              <VuiButton 
                  variant="gradient" 
                  size="small" 
                  color="light" 
                  iconOnly className="float-right" 
                  onClick={() =>  setTimeToConnect(false)}
                >
                    <Icon>close</Icon>
                </VuiButton>
              </Grid>          
              <Grid item xs={12} mt = {2}>
                
                <VuiTypography
                  fontSize={16}
                  fontWeight="medium"
                  color="white"
                >
                  Connect to a wallet
                </VuiTypography>
              </Grid>
              <Grid item xs={12} mt={4}>
                <WebWalletLoginButton 
                  callbackRoute="/"
                  loginButtonText={"Web wallet"}
                  className="custom-login-button "
                />   
              </Grid>    
              <Grid item xs={12}>
                <LedgerLoginButton
                      loginButtonText={"Ledger"}
                      callbackRoute="/"
                />  
              </Grid>  
              <Grid item xs={12}>
                <WalletConnectLoginButton
                  callbackRoute="/"
                  loginButtonText={"Maiar"}
                />  
              </Grid>  
              <Grid item xs={12} mb={4}>
                <ExtensionLoginButton
                  callbackRoute="/"
                  loginButtonText={"Extension"}
                  className="dapp-core-ui-component-2"
                />  
              </Grid>            
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  ) : (
    ""
  );

  let connectLoggedinSection = " ";
  if(!isLoggedIn){
    connectLoggedinSection = connectSection;
  }  

  let connectButton = isLoggedIn ? (
    <VuiButton 
      fullWidth
      variant="outlined" 
      color="light" 
      size="small" 
      sx={{ minWidth: 145}}
      onClick={() => logout(`${window.location.origin}/`)}
    >
        Disconnect
    </VuiButton>
  ) : (
    <VuiButton 
      fullWidth
      variant="outlined" 
      color="light" 
      size="small" 
      sx={{ minWidth: 145}}
      onClick={() =>  setTimeToConnect(prevCheck => !prevCheck)}
    >
      <Icon>wallet</Icon>&nbsp;
      Connect
    </VuiButton>
  );

  var fls = address.slice(0,20);
  var lls = address.slice(50,62);

  const [whitelistData, setWhitelistData] = useState(null);
  const getData=()=>{
    fetch('whitelist.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    })
    .then(function(response){
      //console.log(response);
      return response.json();
    })
    .then(function(myJson) {
      //console.log(myJson);
      setWhitelistData(myJson);
    });
  }

  var whitelistVar = [];
  var whitelistSwitcher = false;
  if(!whitelistData){
    whitelistVar.addresses = [];
  }else{
    whitelistVar = whitelistData;
  }
  if(isLoggedIn){
    whitelistVar.addresses.map(name => {
      if(name == address){
        whitelistSwitcher = true;
      }
    })
  }

  var whitelistColor = "info";
  if(whitelistSwitcher){
    whitelistColor = "info"
  }

  //Get the nfts account amount
  const [rustNFTS, setRustNFTS] = useState(0);
  const [bronzeNFTS, setBronzeNFTS] = useState(0);
  const [silverNFTS, setSilverNFTS] = useState(0);
  const [goldNFTS, setGoldNFTS] = useState(0);
  const [platinumNFTS, setPlatinumNFTS] = useState(0);
  const [legendaryNFTS, setLegendaryNFTS] = useState(0);
  const [acountNFTs, setAcountNFTs] = useState(0);
  var nftApiLink = "https://api.elrond.com/accounts/" + address + "/nfts?size=500&search=XLHO-5135c9";
  const getAcountNFTS = async () => {
    try {
      const response = await fetch(
          nftApiLink,
          {
            headers: {
              'Accept': 'application/json',
            }
          });
      const json = await response.json();
      let countRust = 0;
      let countBronze = 0;
      let countSilver = 0;
      let countGold = 0;
      let countPlatinum = 0;
      let countLegendary = 0;
      if(json){
        json.map(item => {
          if(item.metadata.attributes[3].value == "rust"){
            countRust += 1;
          }else if (item.metadata.attributes[3].value == "bronze"){
            countBronze += 1;
          }else if (item.metadata.attributes[3].value == "silver"){
            countSilver += 1;
          }else if (item.metadata.attributes[3].value == "gold"){
            countGold += 1;
          }else if (item.metadata.attributes[3].value == "platinum"){
            countPlatinum += 1;
          }else if (item.metadata.attributes[3].value == "Orange"){
            countLegendary += 1;
          }

        })
        setRustNFTS(countRust);
        setBronzeNFTS(countBronze);
        setSilverNFTS(countSilver);
        setGoldNFTS(countGold);
        setPlatinumNFTS(countPlatinum);
        setLegendaryNFTS(countLegendary);
      }
    } catch (error) {
      console.error(error);
    }
  }
 
  useEffect(() => {    
    if(isLoggedIn) {
      getData();
      getAcountNFTS();
    }
  }, [isLoggedIn]);

  useEffect(() => {    
    if(isLoggedIn) {
      getData();
      getAcountNFTS();
    }
  }, []);

  var egldAccount = account.balance/1000000000000000000;
  if(!egldAccount){
    egldAccount = 0;
  }

  //Copy utility
  const [isCopied, setIsCopied] = React.useState(false);
  function CopyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }

  if(isLoggedIn){
    return (   
      <React.Fragment>    
        <Grid container spacing={1}>           
          <Grid item xs={6} sm={6} md={3} lg={2}>  
            <VuiButton fullWidth variant="outlined" color="light" size="small" onClick={handleMiniSidenav} sx={{ minWidth: 140}}>
              <Icon>{miniSidenav ? "menu_open" : "menu"}</Icon>&nbsp;
              Menu
            </VuiButton>
          </Grid> 
          <Grid item xs={6} sm={6} md={3} lg={2}>  
            {connectButton}  
          </Grid>   
          {/* <Grid item xs={6} sm={6} md={3} lg={2}>  
            <VuiButton 
              fullWidth 
              variant="outlined"
              color="light"
              size="small"
              onClick={()=> openInNewTab('https://x-launcher.synaps.me')} 
              sx={{ minWidth: 140}}
            >
              KYC
            </VuiButton>
          </Grid>   */}
          <Grid item xs={12} sm={12} md={3} lg={2}>

          </Grid>

          <Grid item xs={6} sm={6} md={3} lg={2}>  
            <VuiButton 
              fullWidth 
              variant="outlined"
              color="light"
              size="small"
              onClick={()=> openInNewTab('https://xoxno.com/buy/XLauncher/XLauncherOrigins')} 
              sx={{ minWidth: 140}}
            >
              NFT Mint
            </VuiButton>
          </Grid>  
          <Grid item xs={6} sm={6} md={3} lg={2}>  
            <VuiButton 
              fullWidth 
              variant="outlined"
              color="light"
              size="small"
              onClick={()=> openInNewTab('https://forms.gle/XdiY6kTF2fNUcxZy8')} 
              sx={{ minWidth: 140}}
            >
              APPLY TO US
            </VuiButton>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}> 
            <VuiButton
              variant="outlined"
              color="light"
              fullWidth
              size="small"
              onClick={() => handleOpen()}
            >
              MY ACCOUNT
            </VuiButton>   
          </Grid> 
          {connectLoggedinSection}   
        </Grid>
        {/* Modal Stake */}
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <VuiBox sx={{ minHeight: "250px" }} className="farm-card">
                <VuiButton
                    variant="gradient"
                    size="small"
                    color="error"
                    iconOnly className="float-right"
                    onClick={() =>  handleClose()}
                >
                  <Icon>close</Icon>
                </VuiButton>
                <VuiBox display="flex" mb="12px">
                  <VuiBox display="flex" flexDirection="column" lineHeight={0}>
                    <VuiTypography
                        fontSize={16}
                        fontWeight="medium"
                        color="white"
                        textTransform="capitalize"
                        id="transition-modal-title"
                    >
                      Account Details:
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
                <VuiBox id="transition-modal-description" sx={{ mt: 1 }} textAlign={"center"}>
                  <VuiTypography
                      fontSize={14}
                      color="success"
                      textTransform="capitalize"
                  >
                    Address:
                  </VuiTypography>
                  <Divider light />
                  <Grid container>
                    <Grid item xs={11} sm={11} md={11} lg={11}>
                      <VuiTypography fontSize="12px" color="white">
                        {fls} ... {lls}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1} lg={1}>
                      <VuiBox mt="-10px">
                        {!isCopied ?
                          <VuiButton
                            variant="text"
                            size="medium"
                            iconOnly
                            onClick={() =>  CopyToClipboard(address)}
                          >
                            <Icon>copy</Icon>
                          </VuiButton>
                        :
                            <VuiButton
                                variant="text"
                                size="medium"
                                iconOnly
                            >
                              <Icon>check</Icon>
                            </VuiButton>
                        }
                      </VuiBox>
                    </Grid>
                  </Grid>

                  <VuiTypography
                      fontSize={14}
                      color="success"
                      textTransform="capitalize"
                      mt={4}
                  >
                    Tokens:
                  </VuiTypography>
                  <Divider light />
                  <Grid container>
                    <Grid item xs={6}>
                      <VuiTypography
                          fontSize={12}
                          color="white"
                          textTransform="capitalize"
                          marginBottom="5px"
                          marginTop="2px"
                      >
                        {new Intl.NumberFormat("en-En", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(balanceXLH)}
                        &nbsp; &nbsp; XLH
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={6}>
                      <VuiTypography
                          fontSize={12}
                          color="white"
                          textTransform="capitalize"
                          marginBottom="5px"
                          marginTop="2px"
                      >
                        {calc2(egldAccount)}
                        &nbsp; &nbsp; EGLD
                      </VuiTypography>
                    </Grid>
                  </Grid>

                  <VuiTypography
                      fontSize={14}
                      color="success"
                      textTransform="capitalize"
                      mt={4}
                  >
                    XLH Origins NFTS ({rustNFTS + bronzeNFTS + silverNFTS + goldNFTS + platinumNFTS + legendaryNFTS})
                  </VuiTypography>
                  <Divider light />
                  <Grid container>
                    <Grid item xs={4}>
                      <VuiTypography
                          fontSize={12}
                          color="white"
                          textTransform="capitalize"
                          marginBottom="5px"
                          marginTop="2px"
                      >
                        Rust: {rustNFTS}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={4}>
                      <VuiTypography
                          fontSize={12}
                          color="white"
                          textTransform="capitalize"
                          marginBottom="5px"
                          marginTop="2px"
                      >
                        Bronze: {bronzeNFTS}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={4}>
                      <VuiTypography
                          fontSize={12}
                          color="white"
                          textTransform="capitalize"
                          marginBottom="5px"
                          marginTop="2px"
                      >
                        Silver: {silverNFTS}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={4}>
                      <VuiTypography
                          fontSize={12}
                          color="white"
                          textTransform="capitalize"
                          marginBottom="5px"
                          marginTop="2px"
                      >
                        Gold: {goldNFTS}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={4}>
                      <VuiTypography
                          fontSize={12}
                          color="white"
                          textTransform="capitalize"
                          marginBottom="5px"
                          marginTop="2px"
                      >
                        Platinum: {platinumNFTS}
                      </VuiTypography>
                    </Grid>
                    <Grid item xs={4}>
                      <VuiTypography
                          fontSize={12}
                          color="white"
                          textTransform="capitalize"
                          marginBottom="5px"
                          marginTop="2px"
                      >
                        Legendary: {legendaryNFTS}
                      </VuiTypography>
                    </Grid>
                  </Grid>
                </VuiBox>
              </VuiBox>
            </Box>
          </Fade>
        </Modal>
      </React.Fragment>
    );
  }else{
    return (   
      <React.Fragment>    
        <Grid container spacing={1}> 
          <Grid item xs={12} sm={12} md={0} lg={4}> 
  
          </Grid>
          <Grid item xs={6} sm={6} md={3} lg={2}>  
            <VuiButton fullWidth variant="outlined" color="light" size="small" onClick={handleMiniSidenav} sx={{ minWidth: 140}}>
              <Icon>{miniSidenav ? "menu_open" : "menu"}</Icon>&nbsp;
              Menu
            </VuiButton>
          </Grid> 
          <Grid item xs={6} sm={6} md={3} lg={2}>  
            {connectButton}  
          </Grid>    
          <Grid item xs={6} sm={6} md={3} lg={2}>  
            <VuiButton 
              fullWidth
              variant="outlined"
              color="white"
              size="small"
              onClick={()=> openInNewTab('https://xoxno.com/buy/XLauncher/XLauncherOrigins')} 
              sx={{ minWidth: 140}}
            >
              NFT Mint
            </VuiButton>
          </Grid>     
          <Grid item xs={6} sm={6} md={3} lg={2}>  
            <VuiButton 
              fullWidth 
              variant="outlined"
              color="white"
              size="small"
              onClick={()=> openInNewTab('https://forms.gle/XdiY6kTF2fNUcxZy8')} 
              sx={{ minWidth: 140}}
            >
              APPLY TO US
            </VuiButton>
          </Grid>    
          {connectLoggedinSection}   
        </Grid>   
      </React.Fragment>
    );
  }
  
}

export default DashboardNavbar;
