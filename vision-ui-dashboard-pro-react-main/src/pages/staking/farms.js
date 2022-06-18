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

import React, { useState, useEffect } from "react";

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
import VuiBadgeDot from "components/VuiBadgeDot";
import VuiTypography from "components/VuiTypography";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import Footer from "examples/FooterXLH";
import Globe from "examples/Globe";
import VuiButton from "components/VuiButton";
import { Scrollbars } from "react-custom-scrollbars";

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
import CompleteUnstakeCard from "cards/CompleteUnstakeCard";

//Elrond
import {
  DappUI,
  logout,
  refreshAccount,
  transactionServices,
  useGetAccountInfo,
  useGetPendingTransactions
} from "@elrondnetwork/dapp-core";
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
  TransactionPayload,
  ContractFunction
} from "@elrondnetwork/erdjs/out";
import {BigNumber} from "bignumber.js"
import { element, object } from "prop-types";
import xConfigs from 'configs/envConfig.json';

const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;

function calc0(theform) {
  var with1Decimal = theform.toString().match(/^-?\d+(?:\\d{0})?/)[0];
  var value = with1Decimal;
  return parseFloat(value);
}

function calc1(theform) {
  var with1Decimal = theform.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
  var value = with1Decimal;
  return parseFloat(value);
}

function calc2(theform) {
  var with2Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  var value = with2Decimals;
  return parseFloat(value);
}


function Farms() {
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
  const trans = useGetPendingTransactions().hasPendingTransactions; 
  const [clientReportData, setClientReportData] = useState(["", "", "", "", "", "", "", ""]);
  let xMultiplier = 1000000000000000000;


  const getClientReportData = async () => {
    try {
      let providerCRD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCRD);

      let stringAddressCRD = xStakeAddress;
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

      let interactionCRD = contractCRD.methods.getClientReport([
        new AddressValue(new Address(address)),
      ]);

      let queryResponseCRD = await contractCRD.runQuery(providerCRD, interactionCRD.buildQuery());

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

      if (myList["report_pull_items"]) {
        if (myList["report_pull_items"][0]) {
          if (myList["report_pull_items"][0]["pool_id"] == "1") {
            farm1Amount = myList["report_pull_items"][0]["pool_amount"].toFixed() / amountFormat;
            farm1Rewards =
              myList["report_pull_items"][0]["rewords_amount"].toFixed() / amountFormat;
          } else if (myList["report_pull_items"][0]["pool_id"] == "2") {
            farm2Amount = myList["report_pull_items"][0]["pool_amount"].toFixed() / amountFormat;
            farm2Rewards =
              myList["report_pull_items"][0]["rewords_amount"].toFixed() / amountFormat;
          } else if (myList["report_pull_items"][0]["pool_id"] == "3") {
            farm3Amount = myList["report_pull_items"][0]["pool_amount"].toFixed() / amountFormat;
            farm3Rewards =
              myList["report_pull_items"][0]["rewords_amount"].toFixed() / amountFormat;
          }
        }
        if (myList["report_pull_items"][1]) {
          if (myList["report_pull_items"][1]["pool_id"] == "1") {
            farm1Amount = myList["report_pull_items"][1]["pool_amount"].toFixed() / amountFormat;
            farm1Rewards =
              myList["report_pull_items"][1]["rewords_amount"].toFixed() / amountFormat;
          } else if (myList["report_pull_items"][1]["pool_id"] == "2") {
            farm2Amount = myList["report_pull_items"][1]["pool_amount"].toFixed() / amountFormat;
            farm2Rewards =
              myList["report_pull_items"][1]["rewords_amount"].toFixed() / amountFormat;
          } else if (myList["report_pull_items"][1]["pool_id"] == "3") {
            farm3Amount = myList["report_pull_items"][1]["pool_amount"].toFixed() / amountFormat;
            farm3Rewards =
              myList["report_pull_items"][1]["rewords_amount"].toFixed() / amountFormat;
          }
        }
        if (myList["report_pull_items"][2]) {
          if (myList["report_pull_items"][2]["pool_id"] == "1") {
            farm1Amount = myList["report_pull_items"][2]["pool_amount"].toFixed() / amountFormat;
            farm1Rewards =
              myList["report_pull_items"][2]["rewords_amount"].toFixed() / amountFormat;
          } else if (myList["report_pull_items"][2]["pool_id"] == "2") {
            farm2Amount = myList["report_pull_items"][2]["pool_amount"].toFixed() / amountFormat;
            farm2Rewards =
              myList["report_pull_items"][2]["rewords_amount"].toFixed() / amountFormat;
          } else if (myList["report_pull_items"][2]["pool_id"] == "3") {
            farm3Amount = myList["report_pull_items"][2]["pool_amount"].toFixed() / amountFormat;
            farm3Rewards =
              myList["report_pull_items"][2]["rewords_amount"].toFixed() / amountFormat;
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
        new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalAmountF),
        new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(totalRewardsF),
        new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(farm1AmountF),
        new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(farm1RewardsF),
        new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(farm2AmountF),
        new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(farm2RewardsF),
        new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(farm3AmountF),
        new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(farm3RewardsF),
        totalAmount, 
        totalRewards,
        farm1Amount, 
        farm1Rewards, 
        farm2Amount, 
        farm2Rewards, 
        farm3Amount,
        farm3Rewards
      ];

      setClientReportData(myReturnList);
    } catch (error) {
      console.log(error);
    }
  };

  const [clientStateData1, setClientStateData1] = useState([]);
  const [clientStateData2, setClientStateData2] = useState([]);
  const [clientStateData3, setClientStateData3] = useState([]);
  const getClientStateData = async () => {
    try {
      let providerCSD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCSD);

      let stringAddressCSD = xStakeAddress;
      let addressCSD = new Address(stringAddressCSD);

      const abiLocationCSD = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;

      let abiRegistryCSD = await AbiRegistry.load({
        urls: [abiLocationCSD],
      });
      let abiCSD = new SmartContractAbi(abiRegistryCSD, [`XLauncherStaking`]);

      let contractCSD = new SmartContract({
        address: addressCSD,
        abi: abiCSD,
      });

      let interactionCSD = contractCSD.methods.getClientState([
        new AddressValue(new Address(address)),
      ]);

      let queryResponseCSD = await contractCSD.runQuery(providerCSD, interactionCSD.buildQuery());

      let responseCSD = interactionCSD.interpretQueryResponse(queryResponseCSD);
      let myListCSD = responseCSD.firstValue.valueOf();
      //console.log("myListCSD " + JSON.stringify(myListCSD, null, 2));

      let pool1 = [];
      let pool2 = [];
      let pool3 = [];
      Object.values(myListCSD).map(element => {
        if(element["pool_id"] == "1"){
          pool1.push(element);
        }
        if(element["pool_id"] == "2"){
          pool2.push(element);
        }
        if(element["pool_id"] == "3"){
          pool3.push(element);
        }
      });   
      setClientStateData1(pool1); 
      setClientStateData2(pool2); 
      setClientStateData3(pool3); 

    } catch (error) {
      console.log(error);
    }
  };

  //Processing the data from getClientStatedata function
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  let cs2Aux = clientStateData2.sort((a,b) => a.pool_time_stamp_entry > b.pool_time_stamp_entry? 1 : -1);
  const client2 =  Object.values(cs2Aux).map(person => {
    let amountClient2 = parseFloat(person.pool_amount) / xMultiplier;
    let amountClient2Formatted = new Intl.NumberFormat("ro-Ro", 
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountClient2);
    //TODO   + 5184000
    let entryClient2 = (parseFloat(person.pool_time_stamp_entry)  + 300) * 1000;
    let date2 = new Date(entryClient2).toLocaleDateString("en-GB", options);
    let keyItem = person.pool_id.toString() + person.pool_amount.toString() +
     person.pool_time_stamp_last_collection.toString() + person.pool_amount.toString();
    return (
      <Grid container spacing={1} justifyContent="space-around" key={keyItem}>
        <Grid item xs={4}>
          <VuiTypography component="span" fontSize={12} fontWeight="regular" color="white">
           {amountClient2Formatted} &nbsp; 
          </VuiTypography>
        </Grid>       
        <Grid item xs={8}>
          <VuiTypography component="span" fontSize={12} fontWeight="regular" color="white">
            &nbsp; Unlocks on {date2}
          </VuiTypography>
        </Grid>
      </Grid>
    )
  })

  let cs3Aux = clientStateData3.sort((a,b) => a.pool_time_stamp_entry > b.pool_time_stamp_entry? 1 : -1);
  const client3 =  Object.values(cs3Aux).map(person3 => {
    let amountClient3 = parseFloat(person3.pool_amount) / xMultiplier;
    let amountClient3Formatted = new Intl.NumberFormat("ro-Ro", 
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amountClient3);
    //TODO   + 15552000
    let entryClient3 = (parseFloat(person3.pool_time_stamp_entry)  + 600) * 1000;
    let date3 = new Date(entryClient3).toLocaleDateString("en-GB", options);
    let keyItem3 = person3.pool_id.toString() + person3.pool_amount.toString() +
     person3.pool_time_stamp_last_collection.toString() + person3.pool_amount.toString();
    return (
      <Grid container spacing={1} justifyContent="space-around" key={keyItem3}>
        <Grid item xs={4}>
          <VuiTypography component="span" fontSize={12} fontWeight="regular" color="white">
           {amountClient3Formatted} &nbsp; 
          </VuiTypography>
        </Grid>
        <Grid item xs={8}>
          <VuiTypography component="span" fontSize={12} fontWeight="regular" color="white">
            &nbsp; Unlocks on {date3}
          </VuiTypography>
        </Grid>
      </Grid>
    )
  })
  
  //Get Account Balance
  const [balanceAccountTokens, setBalanceAccountTokens] = useState([]);  
  const customApi = xApiLink+address+'/tokens/';

  const getBalanceAccount = async () => {
      try {
      const response = await fetch(customApi, { 
          headers: {
              'Accept': 'application/json',
          }
      });
      const json = await response.json();
      setBalanceAccountTokens(json);
      } catch (error) {
      console.error(error);
      }
  }

  let balanceAccount = 0;
  Object.values(balanceAccountTokens).map(element => {
    if(element.identifier == xToken){
      balanceAccount = element.balance;
    }
  }); 
      
  var balanceXLH = balanceAccount/1000000000000000000;
  if(!balanceXLH){
    balanceXLH = 0;
  }

  //Set the amount of xlh for staking from the input or max button
  const [xlhAmountS, setXlhAmountS] = React.useState(0);
  const handleSliderChangeS = (value) => {
    setXlhAmountS(value);
  };
  const handleInputChangeS = (event) => {
    setXlhAmountS(event.target.value);
  };
  const setMaxAmountS = () => {
    setXlhAmountS(calc2(balanceXLH));
  }

  //Calculate the gas limit parameters
  let countItems1 = Object.keys(clientStateData1).length;
  let countItems2 = Object.keys(clientStateData2).length;
  let countItems3 = Object.keys(clientStateData3).length;

  var n1 = countItems1 * (countItems1 + 1) / 2;
  var l1 = 80000 * (10 * countItems1 + n1) + 10000000 + (1000000 * countItems1);

  var n2 = countItems2 * (countItems2 + 1) / 2;
  var l2 = 80000 * (10 * countItems2 + n2) + 10000000 + (1000000 * countItems2);

  var n3 = countItems3 * (countItems3 + 1) / 2;
  var l3 = 80000 * (10 * countItems3 + n3) + 10000000 + (1000000 * countItems3);

  

  let gasLimit1 = 10000000;
  let gasLimit2 = 10000000;
  let gasLimit3 = 10000000;

  //gas limit 1
  if(l1 >= 10000000 && l1 < 30000000){
    gasLimit1 = 30000000;
  }else if(l1 >= 30000000 && l1 < 60000000){
    gasLimit1 = 60000000;
  }else if(l1 >= 60000000 && l1 < 100000000){
    gasLimit1 = 100000000;
  }else if(l1 >= 100000000){
    gasLimit1 = 600000000;
  }

  //gas limit 2
  if(l2 >= 10000000 && l2 < 30000000){
    gasLimit2 = 30000000;
  }else if(l2 >= 30000000 && l2 < 60000000){
    gasLimit2 = 60000000;
  }else if(l2 >= 60000000 && l2 < 100000000){
    gasLimit2 = 100000000;
  }else if(l2 >= 100000000){
    gasLimit2 = 600000000;
  }

  //gas limit 3
  if(l3 >= 10000000 && l3 < 30000000){
    gasLimit3 = 30000000;
  }else if(l3 >= 30000000 && l3 < 60000000){
    gasLimit3 = 60000000;
  }else if(l3 >= 60000000 && l3 < 100000000){
    gasLimit3 = 100000000;
  }else if(l3 >= 100000000){
    gasLimit3 = 600000000;
  }

  //Stake Function
  const [transactionSessionId, setTransactionSessionId] = React.useState(null);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleOpen2 = () => setOpen2(true);
  const handleOpen3 = () => setOpen3(true);
  const handleClose = () => {
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);
    setXlhAmountS(0);
  };

  const stakeXLH = async (farmId, xlhAmount) => {
    console.log("Formatting stake transaction");
    setOpen1(false);
    setOpen2(false);
    setOpen3(false);

    let multiplier = 1000000000000000000;
    let finalXLHAmount = xlhAmount * multiplier;
    let SData = TransactionPayload.contractCall()
    .setFunction(new ContractFunction("ESDTTransfer"))
    .setArgs([
        BytesValue.fromUTF8(xToken),
        new BigUIntValue(new BigNumber(finalXLHAmount)),
        BytesValue.fromUTF8("stake"),
        new BigUIntValue(new BigNumber(farmId)),
    ])
    .build().toString()

    const createStakeTransaction = {
      value: "0",
      data: SData,
      receiver: xStakeAddress,
      gasLimit: 30000000,
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [createStakeTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Stake Transaction",
        errorMessage: "An error has occured during Stake Transaction",
        successMessage: "Stake Transaction successful",
      },
      redirectAfterSign: false,
    });
    if (sessionId != null) {
      console.log("sessionId", sessionId);
      setTransactionSessionId(sessionId);
    }
  };

  //Set the amount of xlh for unstaking from the input or max button
  const [xlhAmountU, setXlhAmountU] = React.useState(0);
  const handleSliderChangeU = (value) => {
    setXlhAmountU(value);
  };
  const handleInputChangeU = (event) => {
    setXlhAmountU(event.target.value);
  };
  const setMaxAmountU = (maxU) => {
    setXlhAmountU(calc2(maxU));
  }


  //Unstake Function
  const [transactionSessionIdU, setTransactionSessionIdU] = React.useState(null);
  const [openU1, setOpenU1] = useState(false);
  const [openU2, setOpenU2] = useState(false);
  const [openU3, setOpenU3] = useState(false);
  const handleOpenU1 = () => setOpenU1(true);
  const handleOpenU2 = () => setOpenU2(true);
  const handleOpenU3 = () => setOpenU3(true);
  const handleCloseU = () => {
    setOpenU1(false);
    setOpenU2(false);
    setOpenU3(false);
    setXlhAmountU(0);
  };

  const unstakeXLH = async (farmIdU, xlhAmountU) => {
    console.log("Formatting unstake transaction");
    setOpenU1(false);
    setOpenU2(false);
    setOpenU3(false);

    let multiplierU = 1000000000000000000;
    let finalXLHAmountU = xlhAmountU * multiplierU;
    let UData = TransactionPayload.contractCall()
    .setFunction(new ContractFunction("unstake"))
    .setArgs([
        new BigUIntValue(new BigNumber(farmIdU)),
        new BigUIntValue(new BigNumber(finalXLHAmountU)),
    ])
    .build().toString()

    const createUnstakeTransaction = {
      value: "0",
      data: UData,
      receiver: xStakeAddress,
      gasLimit: 30000000,
    };

    await refreshAccount();

    const { sessionIdU /*, error*/ } = await sendTransactions({
      transactions: [createUnstakeTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Unstake Transaction",
        errorMessage: "An error has occured during Unstake Transaction",
        successMessage: "Unstake Transaction successful",
      },
      redirectAfterSign: false,
    });
    if (sessionIdU != null) {
      console.log("sessionIdU ", sessionIdU);
      setTransactionSessionIdU(sessionIdU);
    }
  };

  //Claim Function
   const [transactionSessionIdC, setTransactionSessionIdC] = React.useState(null);
   const claimXLH = async (farmIdC, gasLimitC) => {
    console.log("Formatting claim transaction");

    let CData = TransactionPayload.contractCall()
    .setFunction(new ContractFunction("claim"))
    .setArgs([
        new BigUIntValue(new BigNumber(farmIdC))
    ])
    .build().toString()

    const createClaimTransaction = {
      value: "0",
      data: CData,
      receiver: xStakeAddress,
      gasLimit: gasLimitC,
    };

    await refreshAccount();

    const { sessionIdC /*, error*/ } = await sendTransactions({
      transactions: [createClaimTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Claim Transaction",
        errorMessage: "An error has occured during Claim Transaction",
        successMessage: "Claim Transaction successful",
      },
      redirectAfterSign: false,
    });
    if (sessionIdC != null) {
      console.log("sessionIdC ", sessionIdC);
      setTransactionSessionIdC(sessionIdC);
    }
  };

   //Reinvest Function
   const [transactionSessionIdR, setTransactionSessionIdR] = React.useState(null);
   const reinvestXLH = async (farmIdR, gasLimitR) => {
    console.log("Formatting reinvest transaction");

    let RData = TransactionPayload.contractCall()
    .setFunction(new ContractFunction("reinvest"))
    .setArgs([
        new BigUIntValue(new BigNumber(farmIdR))
    ])
    .build().toString()

    const createReinvestTransaction = {
      value: "0",
      data: RData,
      receiver: xStakeAddress,
      gasLimit: gasLimitR,
    };

    await refreshAccount();

    const { sessionIdR /*, error*/ } = await sendTransactions({
      transactions: [createReinvestTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Reinvest Transaction",
        errorMessage: "An error has occured during Reinvest Transaction",
        successMessage: "Reinvest Transaction successful",
      },
      redirectAfterSign: false,
    });
    if (sessionIdR != null) {
      console.log("sessionIdR ", sessionIdR);
      setTransactionSessionIdR(sessionIdR);
    }
  };

  //Claim Unstake Function
  const [transactionSessionIdCU, setTransactionSessionIdCU] = React.useState(null);
  const claimUXLH = async (farmIdCU) => {
   console.log("Formatting claim unstake transaction");

   let CUData = TransactionPayload.contractCall()
   .setFunction(new ContractFunction("claimUnstakedValue"))
  //  .setArgs([
  //      new BigUIntValue(new BigNumber(farmIdCU))
  //  ])
   .build().toString();

   const createClaimUTransaction = {
     value: "0",
     data: CUData,
     receiver: xStakeAddress,
     gasLimit: 30000000,
   };

   await refreshAccount();

   const { sessionIdCU /*, error*/ } = await sendTransactions({
     transactions: [createClaimUTransaction],
     transactionsDisplayInfo: {
       processingMessage: "Claim Unstake Transaction",
       errorMessage: "An error has occured during Claim Unstake Transaction",
       successMessage: "Claim Unstake Transaction successful",
     },
     redirectAfterSign: false,
   });
   if (sessionIdCU != null) {
     console.log("sessionIdCU ", sessionIdCU);
     setTransactionSessionIdCU(sessionIdCU);
   }
 };

  //
  const [openL1, setOpenL1] = useState(false);
  const [openL2, setOpenL2] = useState(false);
  const [openL3, setOpenL3] = useState(false);
  const handleOpenL1 = () => setOpenL1(true);
  const handleOpenL2 = () => setOpenL2(true);
  const handleOpenL3 = () => setOpenL3(true);
  const handleCloseL = () => {
    setOpenL1(false);
    setOpenL2(false);
    setOpenL3(false);
  };

  //Get unstake time and amount farm 2
  let unstakedAmount2 = 0;
  let unstakedEntry2 = "";  
  let unlockedUnstake2 = true;
  let unlockedTime2 = "Unstake";
  const timestamp = Date.now();
  const options2 = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  let c2Aux = clientStateData2.sort((a,b) => a.pool_time_stamp_entry < b.pool_time_stamp_entry? 1 : -1);
  Object.values(c2Aux).map(item2 => {
    //TODO   + 5184000
    let entry2  = (parseFloat(item2.pool_time_stamp_entry)+ 300) * 1000;
    let unlockedTimeItemDays2 = (entry2 - timestamp) / 86400000;
    let unlockedTimeItemHours2 = (entry2 - timestamp) / 3600000;
    let unlockedTimeItemMinutes2 = (entry2 - timestamp) / 60000;
    let unlockedTimeItemSeconds2 = (entry2 - timestamp) / 1000;
    if(calc0(unlockedTimeItemMinutes2) <= 0){
      unlockedTime2 = "Unstake";
    }else if(calc0(unlockedTimeItemMinutes2) > 0 && calc0(unlockedTimeItemMinutes2) < 1){
      unlockedTime2 = "Unstake (" + calc0(unlockedTimeItemSeconds2) + "S)";
    }else if(calc0(unlockedTimeItemMinutes2) >= 1 && calc0(unlockedTimeItemMinutes2) < 60){
      unlockedTime2 = "Unstake (" + calc0(unlockedTimeItemMinutes2) + "M)";
    }else if(calc0(unlockedTimeItemMinutes2) >= 60 && calc0(unlockedTimeItemMinutes2) < 1440){
      unlockedTime2 = "Unstake (" + calc0(unlockedTimeItemHours2) + "H)";
    }else if(calc0(unlockedTimeItemMinutes2) >= 1440){
      unlockedTime2 = "Unstake (" + calc0(unlockedTimeItemDays2) + "D)";
    }    
    if(entry2 <= timestamp){
      unstakedEntry2 = "Available from " + new Date(entry2).toLocaleDateString("en-GB", options2);
      unstakedAmount2 += parseFloat(item2.pool_amount) / xMultiplier;
      unlockedUnstake2 = false;
    } 
  });

  //Get unstake time and amount farm 3
  let unstakedAmount3 = 0;
  let unstakedEntry3 = ""; 
  let unlockedUnstake3 = true;
  let unlockedTime3 = "Unstake";
  let c3Aux = clientStateData3.sort((a,b) => a.pool_time_stamp_entry < b.pool_time_stamp_entry? 1 : -1);
  Object.values(c3Aux).map(item3 => {
    //TODO   + 15552000
    let entry3  = (parseFloat(item3.pool_time_stamp_entry) + 600) * 1000;
    let unlockedTimeItemDays3 = (entry3 - timestamp) / 86400000;
    let unlockedTimeItemHours3 = (entry3 - timestamp) / 3600000;
    let unlockedTimeItemMinutes3 = (entry3 - timestamp) / 60000;
    let unlockedTimeItemSeconds3 = (entry3 - timestamp) / 1000;
    if(calc0(unlockedTimeItemMinutes3) <= 0){
      unlockedTime3 = "Unstake";
    }else if(calc0(unlockedTimeItemMinutes3) > 0 && calc0(unlockedTimeItemMinutes3) < 1){
      unlockedTime3 = "Unstake (" + calc0(unlockedTimeItemSeconds3) + "S)";
    }else if(calc0(unlockedTimeItemMinutes3) >= 1 && calc0(unlockedTimeItemMinutes3) < 60){
      unlockedTime3 = "Unstake (" + calc0(unlockedTimeItemMinutes3) + "M)";
    }else if(calc0(unlockedTimeItemMinutes3) >= 60 && calc0(unlockedTimeItemMinutes3) < 1440){
      unlockedTime3 = "Unstake (" + calc0(unlockedTimeItemHours3) + "H)";
    }else if(calc0(unlockedTimeItemMinutes3) >= 1440){
      unlockedTime3 = "Unstake (" + calc0(unlockedTimeItemDays3) + "D)";
    }   
    if(entry3 <= timestamp){
      unstakedEntry3 = "Available from " + new Date(entry3).toLocaleDateString("en-GB", options2);
      unstakedAmount3 += parseFloat(item3.pool_amount) / xMultiplier;
      unlockedUnstake3 = false;
    } 
  });

  const [claimUnstakedAmount, setClaimUnstakedAmount] = useState(0);
  const [claimUnstakedEntry, setClaimUnstakedEntry] = useState("");
  const [claimUnlockedUnstake, setClaimUnlockedUnstake] = useState(true);
  const [claimUnlockedTime, setClaimUnlockedTime] = useState("Claim Unstake");
  const getClientUnstakeStateData = async () => {
    try {
      let providerCUSD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCUSD);

      let stringAddressCUSD = xStakeAddress;
      let addressCUSD = new Address(stringAddressCUSD);

      const abiLocationCUSD = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;

      let abiRegistryCUSD = await AbiRegistry.load({
        urls: [abiLocationCUSD],
      });
      let abiCUSD = new SmartContractAbi(abiRegistryCUSD, [`XLauncherStaking`]);

      let contractCUSD = new SmartContract({
        address: addressCUSD,
        abi: abiCUSD,
      });

      let interactionCUSD = contractCUSD.methods.getUnstakeState([
        new AddressValue(new Address(address)),
      ]);
      let queryResponseCUSD = await contractCUSD.runQuery(providerCUSD, interactionCUSD.buildQuery());

      let myListCUSD = null;
      if(!queryResponseCUSD.returnMessage){
        let responseCUSD = interactionCUSD.interpretQueryResponse(queryResponseCUSD);
        myListCUSD = responseCUSD.firstValue.valueOf();
      }   //console.log("myListCUSD " + JSON.stringify(myListCUSD, null, 2));

      if(myListCUSD){        
        let entryCU  = (parseFloat(myListCUSD.free_after_time_stamp)) * 1000;
        let unlockedTimeItemCUDays = (entryCU - timestamp) / 86400000;
        let unlockedTimeItemCUHours = (entryCU - timestamp) / 3600000;
        let unlockedTimeItemCUMinutes = (entryCU - timestamp) / 60000;
        let unlockedTimeItemCUSeconds = (entryCU - timestamp) / 1000;
        if(calc0(unlockedTimeItemCUMinutes) <= 0){
          setClaimUnlockedTime("Claim Unstake");
        }else if(calc0(unlockedTimeItemCUMinutes) > 0 && calc0(unlockedTimeItemCUMinutes) < 1){
          setClaimUnlockedTime("Claim Unstake (" + calc0(unlockedTimeItemCUSeconds) + "S)");
        }else if(calc0(unlockedTimeItemCUMinutes) >= 1 && calc0(unlockedTimeItemCUMinutes) < 60){
          setClaimUnlockedTime("Claim Unstake (" + calc1(unlockedTimeItemCUMinutes) + "M)");
        }else if(calc0(unlockedTimeItemCUMinutes) >= 60 && calc0(unlockedTimeItemCUMinutes) < 1440){
          setClaimUnlockedTime("Claim Unstake (" + calc0(unlockedTimeItemCUHours) + "H)");
        }else if(calc0(unlockedTimeItemCUMinutes) >= 1440){
          setClaimUnlockedTime("Claim Unstake (" + calc0(unlockedTimeItemCUDays) + "D)");
        } 

        let AmountCU = parseFloat(myListCUSD.requested_amount) / xMultiplier;
        let AmountCUF = new Intl.NumberFormat("ro-Ro", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(AmountCU);
        setClaimUnstakedAmount(AmountCUF);
        let EntryCUTips = new Date(entryCU).toLocaleDateString("en-GB", options2); 
        setClaimUnstakedEntry(EntryCUTips); 

        if(entryCU <= timestamp){              
          setClaimUnlockedUnstake(false);
        } 
      }else{        
        setClaimUnstakedAmount(0);
        setClaimUnstakedEntry("");
        setClaimUnlockedTime("Claim Unstake");
        setClaimUnlockedUnstake(true);        
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Disable claim function if xlh amount is too small
  let disabledClaim1 = true;
  let disabledClaim2 = true;
  let disabledClaim3 = true;
  if(clientReportData[11] >= 0){
    disabledClaim1 = false;
  }
  if(clientReportData[13] >= 0){
    disabledClaim2 = false;
  }
  if(clientReportData[15] >= 0){
    disabledClaim3 = false;
  }

  //Disable reinvest function if xlh amount is too small
  let disabledReinvest1 = true;
  let disabledReinvest2 = true;
  let disabledReinvest3 = true;
  if(clientReportData[11] >= 0){
    disabledReinvest1 = false;
  }
  if(clientReportData[13] >= 0){
    disabledReinvest2 = false;
  }
  if(clientReportData[15] >= 0){
    disabledReinvest3 = false;
  }

  //Disable stake, claim, reinvest, unstake and claim unstake if any tranzaction is active
  let unlockedStake1 = false;
  let unlockedStake2 = false;
  let unlockedStake3 = false;
  let unlockedUnstake1 = false;
  let unlockedCompleteUnstake = false;
  if(trans){
    unlockedStake1 = true;
    unlockedStake2 = true;
    unlockedStake3 = true;
    disabledClaim1 = true;
    disabledClaim2 = true;
    disabledClaim3 = true;
    disabledReinvest1 = true;
    disabledReinvest2 = true;
    disabledReinvest3 = true;
    unlockedUnstake1 = true;
    unlockedUnstake2 = true;
    unlockedUnstake3 = true;
    unlockedCompleteUnstake = true;
  }
  let unlockedCompleteUnstakeDisabled = false;
  if(claimUnlockedUnstake || unlockedCompleteUnstake){
    unlockedCompleteUnstakeDisabled = true;
  }

  let disabledStakeButton;
  if(xlhAmountS == 0 || xlhAmountS > balanceXLH){
    disabledStakeButton = true;
  }else{
    disabledStakeButton = false;
  }

  let disabledUnstakeButton1;
  if(xlhAmountU == 0 || xlhAmountU > clientReportData[10]){
    disabledUnstakeButton1 = true;
  }else{
    disabledUnstakeButton1 = false;
  }

  let disabledUnstakeButton2;
  if(xlhAmountU == 0 || xlhAmountU > clientReportData[12]){
    disabledUnstakeButton2 = true;
  }else{
    disabledUnstakeButton2 = false;
  }

  let disabledUnstakeButton3;
  if(xlhAmountU == 0 || xlhAmountU > clientReportData[14]){
    disabledUnstakeButton3 = true;
  }else{
    disabledUnstakeButton3 = false;
  }

  //useEffect after based on login parameter
  useEffect(() => {
    if(isLoggedIn) {
      getClientReportData(); 
      getClientStateData();
      getClientUnstakeStateData();
      getBalanceAccount();
    }
  }, [isLoggedIn]);

  //useEffect based on timer to display the current rewards and the modal with the list of rewards
  const MINUTE_MS = 4000;
  useEffect(() => {
    if(isLoggedIn) {
      const interval = window.setInterval(() => {
        getBalanceAccount();
        getClientReportData(); 
        getClientStateData();
        getClientUnstakeStateData();
      }, MINUTE_MS);

      return () => window.clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, [])
  
  return (
    <Main name="Staking">
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals className="custom-class-for-modals" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <StakingCard
            title="Farm 1"
            lockedTime="0 days locked"
            apr="40%"
            myXLH={clientReportData[2]}
            unstakedAmount = {clientReportData[10]}
            myRewards={clientReportData[3]}
            xlhBalance={balanceXLH}     
            modalFarmName="Farm 1"  
            lockedRewardsLabel = "&nbsp;"
            mbv="11px"
            stake={{
              size: "small",
              color: "info",
              label: "Stake",
              disabled: unlockedStake1,
              disabledAction:disabledStakeButton
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed with a minimum of 25XLH",
              disabled: disabledClaim1
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint: "Individual rewards can be reinvested with a minimum of 25XLH",
              disabled: disabledReinvest1
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: "Unstake",
              hint: "Individual rewards can be claimed 10 days after unstake tranzaction",
              disabled: unlockedUnstake1,
              disabledAction:disabledUnstakeButton1
            }} 
            methodS = {() => stakeXLH(1, xlhAmountS)}
            maxMethodS = {() => setMaxAmountS()}
            handleSliderChangeS = {e => handleSliderChangeS(e.target.value)}
            handleInputChangeS = {e => handleInputChangeS(e)}
            xlhAmountValueS = {xlhAmountS}
            openS = {open1}
            handleOpenS = {handleOpen1}
            handleCloseS = {handleClose}
            methodU = {() => unstakeXLH(1, xlhAmountU)}
            maxMethodU = {() => setMaxAmountU(clientReportData[10])}
            handleSliderChangeU = {e => handleSliderChangeU(e.target.value)}
            handleInputChangeU = {e => handleInputChangeU(e)}
            xlhAmountValueU = {xlhAmountU}
            openU = {openU1}
            handleOpenU = {handleOpenU1}
            handleCloseU = {handleCloseU}
            methodC = {() => claimXLH(1, gasLimit1)}
            methodR = {() => reinvestXLH(1, gasLimit1)}  
            lockedRewards=""
            openL = {openL1}
            handleOpenL = {handleOpenL1}
            handleCloseL = {handleCloseL}  
            isLoggedIn = {isLoggedIn}    
            showInfo = {false}        
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <StakingCard
            title="Farm 2"
            lockedTime="60 days locked"
            apr="110%"
            myXLH={clientReportData[4]}
            myRewards={clientReportData[5]}
            xlhBalance={balanceXLH}
            unstakedAmount = {calc2(unstakedAmount2)}
            lockedRewardsLabel = "My Locked XLH:"
            mbv="-8px"
            stake={{
              size: "small",
              color: "info",
              label: "Stake",
              disabled: unlockedStake2,
              disabledAction:disabledStakeButton
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed with a minimum of 25XLH",
              disabled: disabledClaim2
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint: "Individual rewards can be reinvested with a minimum of 25XLH",
              disabled: disabledReinvest2
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: unlockedTime2,
              hint: "Individual rewards can be claimed 10 days after unstake tranzaction",
              disabled: unlockedUnstake2,
              disabledAction:disabledUnstakeButton2
            }}
            modalFarmName="Farm 2"
            methodS = {() => stakeXLH(2, xlhAmountS)}
            maxMethodS = {() => setMaxAmountS()}
            handleSliderChangeS = {e => handleSliderChangeS(e.target.value)}
            handleInputChangeS = {e => handleInputChangeS(e)}
            xlhAmountValueS = {xlhAmountS}
            openS = {open2}
            handleOpenS = {handleOpen2}
            handleCloseS = {handleClose}
            methodU = {() => unstakeXLH(2, xlhAmountU)}
            maxMethodU = {() => setMaxAmountU(calc2(unstakedAmount2))}
            handleSliderChangeU = {e => handleSliderChangeU(e.target.value)}
            handleInputChangeU = {e => handleInputChangeU(e)}
            xlhAmountValueU = {xlhAmountU}
            openU = {openU2}
            handleOpenU = {handleOpenU2}
            handleCloseU = {handleCloseU}
            methodC = {() => claimXLH(2, gasLimit2)}
            methodR = {() => reinvestXLH(2, gasLimit2)} 
            lockedRewards={client2}   
            openL = {openL2}
            handleOpenL = {handleOpenL2}
            handleCloseL = {handleCloseL} 
            isLoggedIn = {isLoggedIn}
            showInfo = {true}         
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <StakingCard
            title="Farm 3"
            lockedTime="180 days locked"
            apr="180%"
            myXLH={clientReportData[6]}
            myRewards={clientReportData[7]}
            xlhBalance={balanceXLH}
            unstakedAmount = {calc2(unstakedAmount3)}
            lockedRewardsLabel = "My Locked XLH:"
            mbv="-8px"
            stake={{
              size: "small",
              color: "info",
              label: "Stake",
              disabled: unlockedStake3,
              disabledAction:disabledStakeButton
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed with a minimum of 25XLH",
              disabled: disabledClaim3
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint: "Individual rewards can be reinvested with a minimum of 25XLH",
              disabled: disabledReinvest3
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: unlockedTime3,
              hint: "Individual rewards can be claimed 10 days after unstake tranzaction",
              disabled: unlockedUnstake3,
              disabledAction:disabledUnstakeButton3
            }}
            modalFarmName="Farm 3"
            methodS = {() => stakeXLH(3, xlhAmountS)}
            maxMethodS = {() => setMaxAmountS()}
            handleSliderChangeS = {e => handleSliderChangeS(e.target.value)}
            handleInputChangeS = {e => handleInputChangeS(e)}
            xlhAmountValueS = {xlhAmountS}
            openS = {open3}
            handleOpenS = {handleOpen3}
            handleCloseS = {handleClose}
            methodU = {() => unstakeXLH(3, xlhAmountU)}
            maxMethodU = {() => setMaxAmountU(calc2(unstakedAmount3))}
            handleSliderChangeU = {e => handleSliderChangeU(e.target.value)}
            handleInputChangeU = {e => handleInputChangeU(e)}
            xlhAmountValueU = {xlhAmountU}
            openU = {openU3}
            handleOpenU = {handleOpenU3}
            handleCloseU = {handleCloseU}
            methodC = {() => claimXLH(3, gasLimit3)}
            methodR = {() => reinvestXLH(3, gasLimit3)}
            lockedRewards={client3}   
            openL = {openL3}
            handleOpenL = {handleOpenL3}
            handleCloseL = {handleCloseL}  
            isLoggedIn = {isLoggedIn}  
            showInfo = {true}
          />
        </Grid>
      </Grid>   
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <CompleteUnstakeCard
            title = "Claim Unstaked XLH"
            lockedTime = "10 days locked"
            claimUnstakedAmount = {claimUnstakedAmount}
            claimUnstakedEntry = {claimUnstakedEntry}
            claimUnstake= {{
                size: "small",
                color: "info",
                label: claimUnlockedTime,
                disabled: unlockedCompleteUnstakeDisabled
            }} 
            methodCU = {() => claimUXLH(3)}
          />
        </Grid>
      </Grid>
    </Main>
  );
}

export default Farms;
