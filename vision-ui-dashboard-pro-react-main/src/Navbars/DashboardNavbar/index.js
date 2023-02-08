import * as React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from "react";

// react-router components
import { useLocation } from "react-router-dom";

// @material-ui core components
import Divider from "@mui/material/Divider";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

import 'assets/index.css';
import 'assets/custom.css';

// Vision UI Dashboard PRO React context
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";

//Elrond
import { DappUI, logout, useGetAccountInfo, useGetPendingTransactions } from '@elrondnetwork/dapp-core';
import xConfigs from 'configs/envConfig.json';
import {isEmptyArray} from "formik";

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
  let xToken = xConfigs["token"];
  let xApiLink = xConfigs["apiLink"];
  let multiplier = 1000000000000000000;

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

  //Get Account Tokens Balance
  const [xlhBalance, setXlhBalance] = useState(0);
  const customApi = xApiLink+address+'/tokens?size=5000';

  const getAccountTokens = async () => {
      try {
      const response = await fetch(customApi, { 
          headers: {
              'Accept': 'application/json',
          }
      });

      const json = await response.json();
      json.map(item => {
        switch (item.identifier) {
          case xToken:
            setXlhBalance(item.balance/multiplier);
        }
      })
      } catch (error) {
      console.error(error);
      }
  }

  //Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if(isLoggedIn) {
      getAccountTokens();
      //console.log("balanceAccount " + balanceAccount);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if(isLoggedIn) {
      getAccountTokens();
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
    ""
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
  const [rustNFTS, setRustNFTS] = useState("0");
  const [bronzeNFTS, setBronzeNFTS] = useState("0");
  const [silverNFTS, setSilverNFTS] = useState("0");
  const [goldNFTS, setGoldNFTS] = useState("0");
  const [platinumNFTS, setPlatinumNFTS] = useState("0");
  const [legendaryNFTS, setLegendaryNFTS] = useState("0");
  const [acountNFTs, setAcountNFTs] = useState("0");
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
      var countRust = 0;
      var countBronze = 0;
      var countSilver = 0;
      var countGold = 0;
      var countPlatinum = 0;
      var countLegendary = 0;
      if(json){
        json.map(item => {
          let nftSwitcher = item.metadata.attributes[3].value;
          switch (nftSwitcher) {
            case "rust":
              countRust += 1;
              break;
            case "bronze":
              countBronze += 1;
              break;
            case "silver":
              countSilver += 1;
              break;
            case "gold":
              countGold += 1;
              break;
            case "platinum":
              countPlatinum += 1;
              break;
            case "Orange":
              countLegendary += 1;
              break;
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

  var egldAccount = account.balance/multiplier;
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
    }, 1500);p
  }

  if(isLoggedIn){
    return (   
      <React.Fragment>    
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={6} lg={8}>

          </Grid>
          <Grid item xs={6} sm={6} md={3} lg={2}>
            <VuiButton fullWidth variant="outlined" color="light" size="small" onClick={handleMiniSidenav} sx={{ minWidth: 140}}>
              <Icon>{miniSidenav ? "menu_open" : "menu"}</Icon>&nbsp;
              Menu
            </VuiButton>
          </Grid>
          <Grid item xs={6} sm={6} md={3} lg={2}>
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
                  <Icon sx={{marginLeft: -0.1}}>close</Icon>
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
                  <Grid container height={"100%"}>
                    <Grid item xs={12}  className="overflow-item">
                      <Grid container>
                        <Grid item xs={6}>
                          <VuiTypography
                              fontSize={12}
                              color="white"
                              textTransform="capitalize"
                              marginBottom="5px"
                              marginTop="2px"
                          >
                            {new Intl.NumberFormat("en-GB", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(xlhBalance)}
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
                    </Grid>
                  </Grid>
                  <Divider light />
                  <Grid container>
                    <Grid item xs={12} sm={12} md={12} lg={12} mt={3}>
                      <VuiButton
                          fullWidth
                          variant="outlined"
                          color="light"
                          size="small"
                          sx={{ minWidth: 145}}
                          onClick={() => logout(`${window.location.origin}/`)}
                      >
                        <VuiTypography color={"white"} sx={{fontSize: 13}}>
                          Disconnect
                        </VuiTypography>
                      </VuiButton>
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
          <Grid item xs={12} sm={12} md={6} lg={8}>
  
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
          {connectLoggedinSection}   
        </Grid>   
      </React.Fragment>
    );
  }
}

export default DashboardNavbar;
