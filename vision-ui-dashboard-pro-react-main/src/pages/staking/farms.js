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
//Display an object in a stylized way in console
//console.log(JSON.stringify(contract, null, 2));


import React, {useState, useEffect} from 'react';

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
import VuiButton from 'components/VuiButton';

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
import {
  DappUI,
  logout,
  refreshAccount,
  transactionServices,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  AddressValue,
  Balance,
  BigUIntValue,
  BytesValue,
  Interaction,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi,
} from "@elrondnetwork/erdjs/out";
import { element } from 'prop-types';

const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;

function Farms() {
  //Elrond login
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const [transactionSessionId, setTransactionSessionId] = React.useState(null);
  const [clientReportData, setClientReportData] = useState(["-","-","-","-","-","-","-","-"]);

  const getClientReportData = async () => {
    try {
      let providerCRD = new ProxyProvider('https://devnet-gateway.elrond.com');
      await NetworkConfig.getDefault().sync(providerCRD);
  
      let stringAddressCRD = "erd1qqqqqqqqqqqqqpgqvfp2xkxhwvrvrcrxzs6e3vz4sz2ms7m0pa7qkrd5ll";
      let addressCRD = new Address(stringAddressCRD);
  
      const abiLocationCRD = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;
  
      let abiRegistryCRD = await AbiRegistry.load({
        urls: [abiLocationCRD],
      });
      let abiCRD = new SmartContractAbi(abiRegistryCRD, [`XLauncherStaking`]);
  
      let contractCRD = new SmartContract({
        address: addressCRD,
        abi: abiCRD,
      });
  
      let interactionCRD = contractCRD.methods.getClientReport(
        [new AddressValue(new Address(address))]
      );
  
      let queryResponseCRD = await contractCRD.runQuery(
        providerCRD,
        interactionCRD.buildQuery()
      );
      
      let responseCRD = interactionCRD.interpretQueryResponse(queryResponseCRD);
      let myList = responseCRD.firstValue.valueOf();
      //console.log("myList " + JSON.stringify(myList, null, 2));

      let amountFormat = 1000000000000000000;
      let totalAmount = myList["total_amount"].toFixed(2) / amountFormat;
      let totalRewards = myList["total_rewords"].toFixed(2) / amountFormat;
  
      let farm1Amount = 0;
      let farm1Rewards = 0;
      let farm2Amount = 0;
      let farm2Rewards = 0;
      let farm3Amount = 0;
      let farm3Rewards = 0;
      
      if(myList["report_pull_items"]){
        if(myList["report_pull_items"][0]){
          if(myList["report_pull_items"][0]["pool_id"] == "1"){
            farm1Amount = myList["report_pull_items"][0]["pool_amount"].toFixed() / amountFormat;
            farm1Rewards = myList["report_pull_items"][0]["rewords_amount"].toFixed() / amountFormat;
          }else if(myList["report_pull_items"][0]["pool_id"] == "2"){
            farm2Amount = myList["report_pull_items"][0]["pool_amount"].toFixed() / amountFormat;
            farm2Rewards = myList["report_pull_items"][0]["rewords_amount"].toFixed() / amountFormat;
          }else if(myList["report_pull_items"][0]["pool_id"] == "3"){
            farm3Amount = myList["report_pull_items"][0]["pool_amount"].toFixed() / amountFormat;
            farm3Rewards = myList["report_pull_items"][0]["rewords_amount"].toFixed() / amountFormat;
          }
        }
        if(myList["report_pull_items"][1]){
          if(myList["report_pull_items"][1]["pool_id"] == "1"){
            farm1Amount = myList["report_pull_items"][1]["pool_amount"].toFixed() / amountFormat;
            farm1Rewards = myList["report_pull_items"][1]["rewords_amount"].toFixed() / amountFormat;
          }else if(myList["report_pull_items"][1]["pool_id"] == "2"){
            farm2Amount = myList["report_pull_items"][1]["pool_amount"].toFixed() / amountFormat;
            farm2Rewards = myList["report_pull_items"][1]["rewords_amount"].toFixed() / amountFormat;
          }else if(myList["report_pull_items"][1]["pool_id"] == "3"){
            farm3Amount = myList["report_pull_items"][1]["pool_amount"].toFixed() / amountFormat;
            farm3Rewards = myList["report_pull_items"][1]["rewords_amount"].toFixed() / amountFormat;
          }
        }
        if(myList["report_pull_items"][2]){
          if(myList["report_pull_items"][2]["pool_id"] == "1"){
            farm1Amount = myList["report_pull_items"][2]["pool_amount"].toFixed() / amountFormat;
            farm1Rewards = myList["report_pull_items"][2]["rewords_amount"].toFixed() / amountFormat;
          }else if(myList["report_pull_items"][2]["pool_id"] == "2"){
            farm2Amount = myList["report_pull_items"][2]["pool_amount"].toFixed() / amountFormat;
            farm2Rewards = myList["report_pull_items"][2]["rewords_amount"].toFixed() / amountFormat;
          }else if(myList["report_pull_items"][2]["pool_id"] == "3"){
            farm3Amount = myList["report_pull_items"][2]["pool_amount"].toFixed() / amountFormat;
            farm3Rewards = myList["report_pull_items"][2]["rewords_amount"].toFixed() / amountFormat;
          }
        }   
      }
      
      let totalAmountF = parseFloat(totalAmount).toFixed(2);
      let totalRewardsF = parseFloat(totalRewards).toFixed(2);
      let farm1AmountF = parseFloat(farm1Amount).toFixed(2);
      let farm1RewardsF = parseFloat(farm1Rewards).toFixed(2);
      let farm2AmountF = parseFloat(farm2Amount).toFixed(2);
      let farm2RewardsF = parseFloat(farm2Rewards).toFixed(2);
      let farm3AmountF = parseFloat(farm3Amount).toFixed(2);
      let farm3RewardsF = parseFloat(farm3Rewards).toFixed(2);
  
      let myReturnList = [
        new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAmountF),
        new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalRewardsF),
        new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(farm1AmountF),
        new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(farm1RewardsF),
        new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(farm2AmountF),
        new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(farm2RewardsF),
        new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(farm3AmountF),
        new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(farm3RewardsF)
      ];
  
      setClientReportData(myReturnList);  
    } catch (error) {
      console.log(error);
    }
  }
  if(isLoggedIn){
    getClientReportData();
  }  
  //arguments $token_id $amount $method_name $pull_id \
  const stakeXLH = async () => {
    console.log("Formatting transaction");
    const createStakeTransaction = {
      data: [
        Buffer.from("stake").toString("hex"),
        Buffer.from("XLH-cb26c7").toString("hex"),
        "1000000000000000000",
        "1"        
      ].join("@"),
      receiver:
        "erd1qqqqqqqqqqqqqpgqvfp2xkxhwvrvrcrxzs6e3vz4sz2ms7m0pa7qkrd5ll",
      gasLimit: 10_000_000,
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [createStakeTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Processing Ping transaction",
        errorMessage: "An error has occured during Ping",
        successMessage: "Ping transaction successful",
      },
      redirectAfterSign: false,
    });
    if (sessionId != null) {
      console.log("sessionId", sessionId);
      setTransactionSessionId(sessionId);
    }

  };






  useEffect(() => {     
    if(isLoggedIn){
      getClientReportData(); 
    }  
  }, []);  

  return (  
    <Main name="Staking">
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals className='custom-class-for-modals' />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <StakingCard       
            title="Farm 1"
            lockedTime="0 days locked"
            apr="40%"
            myXLH={clientReportData[2]}
            myRewards={clientReportData[3]}
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
            myXLH={clientReportData[4]}
            myRewards={clientReportData[5]}
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
            myXLH={clientReportData[6]}
            myRewards={clientReportData[7]}
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
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <VuiButton onClick={()=> stakeXLH()}>
            Stake
          </VuiButton>
        </Grid>
      </Grid>
    </Main> 
  );
}

export default Farms;
