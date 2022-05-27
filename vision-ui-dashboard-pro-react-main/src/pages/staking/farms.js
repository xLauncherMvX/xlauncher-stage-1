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
import { useState, useEffect, useMemo } from "react";

// react-router components
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
// react-router components
import { Link } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import Footer from "examples/FooterXLH";
import Globe from "examples/Globe";

// Plugins custom css
import "assets/theme/base/plugins.css";
import "assets/custom.css";

// icons
import { FaShoppingCart } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";
import { IoWallet, IoDocumentText } from "react-icons/io5";

//Ciio custom components
import Main from "layouts/main";
import StakingCard from "cards/StakingCard";

//Elrond
import { DappUI, logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';

function Farms() {
  //Elrond login
  
  return (  
    <Main name="Staking">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <StakingCard       
            title="Farm 1"
            lockedTime="0 days locked"
            apr="40%"
            myXLH={3000}
            myRewards={300}
            xlhBalance={10000}
            stake={{
              size: "small",
              color: "info",
              label: "Stake",
              action: "",
              max: ""
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed every 120 minutes with a minimum of 25XLH",
              action: ""
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint: "Individual rewards can be reinvested every 120 minutes with a minimum of 25XLH",
              action: ""
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: "Unstake",
              hint: "The Unstake will last 10 days",
              action: ""
            }}
            modalFarmName="Farm 1"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <StakingCard           
            title="Farm 2"
            lockedTime="60 days locked"
            apr="110%"
            myXLH={3000}
            myRewards={300}
            xlhBalance={10000}
            stake={{
              size: "small",
              color: "info",
              label: "Stake",
              action: "",
              max: ""
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed every 120 minutes with a minimum of 25XLH",
              action: ""
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint: "Individual rewards can be reinvested every 120 minutes with a minimum of 25XLH",
              action: ""
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: "Unstake",
              hint: "Unstake will last 10 days",
              action: ""
            }}
            modalFarmName="Farm 2"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <StakingCard          
            title="Farm 3"
            lockedTime="180 days locked"
            apr="180%"
            myXLH={3000}
            myRewards={300}
            xlhBalance={10000}
            stake={{
              size: "small",
              color: "info",
              label: "Stake",
              action: "",
              max: ""
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed every 120 minutes with a minimum of 25XLH",
              action: ""
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint: "Individual rewards can be reinvested every 120 minutes with a minimum of 25XLH",
              action: ""
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: "Unstake",
              hint: "Unstake will last 10 days",
              action: ""
            }}
            modalFarmName="Farm 3"
          />
        </Grid>
      </Grid>
    </Main> 
  );
}

export default Farms;
