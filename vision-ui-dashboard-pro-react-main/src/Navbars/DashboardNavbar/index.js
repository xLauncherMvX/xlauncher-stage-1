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

  var fls = address.slice(0,6);
  var lls = address.slice(55,62);

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
 
  useEffect(() => {    
    if(isLoggedIn) {
      getData();
    }
  }, [isLoggedIn]);

  useEffect(() => {    
    if(isLoggedIn) {
      getData();
    }
  }, []);

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
               
          <Grid item xs={12} sm={12} md={0} lg={2}> 
  
          </Grid> 
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <VuiButton
              color="info"
              fullWidth
              size="small"
            >             
              <VuiTypography fontSize="12px" color="white">{fls} ... {lls}</VuiTypography>
            </VuiButton>   
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}> 
            <VuiButton
              color="info"
              fullWidth
              size="small"
            >    
              <VuiTypography
              fontSize="12px"
              color="white"
              >     
                {new Intl.NumberFormat("ro-Ro", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(balanceXLH)} &nbsp; XLH     
              </VuiTypography>         
            </VuiButton>   
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}>  
            <VuiButton 
              fullWidth 
              variant="contained"
              color={whitelistColor}
              size="small"
              onClick={()=> openInNewTab('https://x-launcher.synaps.me')} 
              sx={{ minWidth: 140}}
            >
              <VuiTypography fontSize="12px" color="white">KYC</VuiTypography>
            </VuiButton>
          </Grid>  
          {connectLoggedinSection}   
        </Grid>   
      </React.Fragment>
    );
  }else{
    return (   
      <React.Fragment>    
        <Grid container spacing={1}> 
          <Grid item xs={12} sm={12} md={3} lg={6}> 
  
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
              variant="contained"
              color={whitelistColor}
              size="small"
              onClick={()=> openInNewTab('https://x-launcher.synaps.me')} 
              sx={{ minWidth: 140}}
            >
              <VuiTypography fontSize="12px" color="white">KYC</VuiTypography>
            </VuiButton>
          </Grid>       
          {connectLoggedinSection}   
        </Grid>   
      </React.Fragment>
    );
  }
  
}

export default DashboardNavbar;
