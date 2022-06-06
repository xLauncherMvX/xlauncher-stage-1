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
import VuiTypography from "components/VuiTypography";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import Footer from "examples/FooterXLH";
import Globe from "examples/Globe";
import VuiButton from "components/VuiButton";

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
  useGetAccountInfo,
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
import { element } from "prop-types";
import xConfigs from 'configs/envConfig.json';

const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;


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
  const [clientReportData, setClientReportData] = useState(["-", "-", "-", "-", "-", "-", "-", "-"]);

  //Get Account Balance
  const [balanceAccount, setBalanceAccount] = useState([0]); 
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
  if(isLoggedIn) {
    getBalanceAccount();
    console.log("balanceAccount " + balanceAccount);
  }
      
  var balanceXLH = balanceAccount/1000000000000000000;
  if(!balanceXLH){
    balanceXLH = 0;
  }

  //Stake Function
  const [transactionSessionId, setTransactionSessionId] = React.useState(null);
  const stakeXLH = async (farmId, xlhAmount) => {
    console.log("Formatting stake transaction");

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
      gasLimit: 10_000_000,
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

  //Set the amount of xlh for staking from the input or max button
  const [xlhAmountS, setXlhAmountS] = React.useState(0);

  function onTodoChangeS(value){
    setXlhAmountS(value);
    console.log('value ' + value); 
  }

  const setMaxAmountS = () => {
    setXlhAmountS(balanceXLH);
    onTodoChangeS(balanceXLH);
    console.log("balanceXLH " + balanceXLH);
  }

  //Unstake Function
  const [transactionSessionIdU, setTransactionSessionIdU] = React.useState(null);
  const unstakeXLH = async (farmIdU, xlhAmountU) => {
    console.log("Formatting unstake transaction");

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
      gasLimit: 10_000_000,
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

  //Set the amount of xlh for unstaking from the input or max button
  const [xlhAmountU, setXlhAmountU] = React.useState(0);

  function onTodoChangeU(value){
    setXlhAmountU(value);
    console.log('value ' + value); 
  }

  const setMaxAmountU = () => {
    setXlhAmountU(balanceXLH);
    onTodoChangeU(balanceXLH);
  }

   //Claim Function
   const [transactionSessionIdC, setTransactionSessionIdC] = React.useState(null);
   const claimXLH = async (farmIdC) => {
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
      gasLimit: 10_000_000,
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
   const reinvestXLH = async (farmIdR) => {
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
      gasLimit: 10_000_000,
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
  

  //useEffectFunc
  useEffect(() => {
    if (isLoggedIn) {
      getBalanceAccount();
    }
  }, []);
  

  return (
    <Main name="Staking">
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals className="custom-class-for-modals" />
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <VuiTypography size="20px" color="white">Date test</VuiTypography>
          <VuiTypography color="white">
            Xlh Amount:  
            {new Intl.NumberFormat("ro-Ro", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(balanceXLH)}
          </VuiTypography>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4} xl={4}>
          <StakingCard
            title="Farm 1"
            lockedTime="0 days locked"
            apr="40%"
            myXLH={clientReportData[2]}
            myRewards={clientReportData[3]}
            xlhBalance={balanceXLH}            
            methodS = {() => stakeXLH(1, xlhAmountS)}
            maxMethodS = {() => setMaxAmountS()}
            onChangeMethodS = {e => onTodoChangeS(e.target.value)}
            xlhAmountValueS = {xlhAmountS}
            methodU = {() => unstakeXLH(1, xlhAmountU)}
            maxMethodU = {() => setMaxAmountU()}
            onChangeMethodU = {e => onTodoChangeU(e.target.value)}
            xlhAmountValueU = {xlhAmountU}
            methodC = {() => claimXLH(1)}
            methodR = {() => reinvestXLH(1)}
            stake={{
              size: "small",
              color: "info",
              label: "Stake"
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed every 120 minutes with a minimum of 25XLH"
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint:
                "Individual rewards can be reinvested every 120 minutes with a minimum of 25XLH"
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: "Unstake",
              hint: "The Unstake will last 10 days"
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
            xlhBalance={balanceXLH}
            methodS = {() => stakeXLH(2, xlhAmountS)}
            maxMethodS = {() => setMaxAmountS()}
            onChangeMethodS = {e => onTodoChangeS(e.target.value)}
            xlhAmountValueS = {xlhAmountS}
            methodU = {() => unstakeXLH(2, xlhAmountU)}
            maxMethodU = {() => setMaxAmountU()}
            onChangeMethodU = {e => onTodoChangeU(e.target.value)}
            xlhAmountValueU = {xlhAmountU}
            methodC = {() => claimXLH(2)}
            methodR = {() => reinvestXLH(2)}
            stake={{
              size: "small",
              color: "info",
              label: "Stake"
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed every 120 minutes with a minimum of 25XLH"
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint:
                "Individual rewards can be reinvested every 120 minutes with a minimum of 25XLH"
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: "Unstake",
              hint: "Unstake will last 10 days"
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
            xlhBalance={balanceXLH}
            methodS = {() => stakeXLH(3, xlhAmountS)}
            maxMethodS = {() => setMaxAmountS()}
            onChangeMethodS = {e => onTodoChangeS(e.target.value)}
            xlhAmountValueS = {xlhAmountS}
            methodU = {() => unstakeXLH(3, xlhAmountU)}
            maxMethodU = {() => setMaxAmountU()}
            onChangeMethodU = {e => onTodoChangeU(e.target.value)}
            xlhAmountValueU = {xlhAmountU}
            methodC = {() => claimXLH(3)}
            methodR = {() => reinvestXLH(3)}
            stake={{
              size: "small",
              color: "info",
              label: "Stake"
            }}
            claim={{
              size: "small",
              color: "primary",
              label: "Claim",
              hint: "Individual rewards can be claimed every 120 minutes with a minimum of 25XLH"
            }}
            reinvest={{
              size: "small",
              color: "success",
              label: "Reinvest",
              hint:
                "Individual rewards can be reinvested every 120 minutes with a minimum of 25XLH"
            }}
            unstake={{
              size: "small",
              color: "dark",
              label: "Unstake",
              hint: "Unstake will last 10 days"
            }}
            modalFarmName="Farm 3"
          />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4} xl={4}>
          <VuiButton onClick={() => claimXLH(1)}>Claim</VuiButton>
        </Grid> */}
      </Grid>
    </Main>
  );
}

export default Farms;
