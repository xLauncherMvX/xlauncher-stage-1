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

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";
// Vision UI Dashboard PRO React base styles
import typography from "assets/theme/base/typography";
// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import Footer from "examples/FooterXLH";
import Globe from "examples/Globe";
// Vision UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// icons
import { FaShoppingCart } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";
import { IoWallet, IoDocumentText } from "react-icons/io5";

import Main from "layouts/main";
import CountdownTimer from "components/countdownTimerZ2IPublic";
import profile1 from "assets/images/zero2InfinityMini.jpeg";
import RefundCard from "cards/RefundCardZ2I";
import VuiButton from "components/VuiButton";

import {
  DappUI,
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
  TransactionPayload,
  ContractFunction
} from "@elrondnetwork/erdjs/out";

import xConfigs from 'configs/z2iRefundConfig.json';
import "assets/custom.css";
import "assets/index.css";


const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;

function Z2IRefund() {
  const { values } = breakpoints;
  let xPresaleAddress = xConfigs["presaleAddress"];

  const contractByToken = async (z2iAmount) => {
    console.log('Time to buy', z2iAmount);

    console.log("Formatting transaction");
    const createRefundTransaction = {
      value: z2iAmount,
      data: [
        "buyback",
      ].join("@"),
      receiver: xPresaleAddress,
      gasLimit: 15_000_000,
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [createRefundTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Processing Refund transaction",
        errorMessage: "An error has occured during Refund",
        successMessage: "Refund transaction successful",
      },
      redirectAfterSign: true,
      callbackRoute: '/refunds/z2iPublic'
    });
    if (sessionId != null) {
      console.log("sessionId", sessionId);
      setTransactionSessionId(sessionId);
    }
  };
  
  return (    
    <Main name="">  
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals className="custom-class-for-modals" />  
      <Grid container spacing={3}>
        <Grid item xs={12} lg={3}>

        </Grid>
        <Grid item xs={12} lg={6} alignItems="center" textAlign="center" mb={3}>          
          <div className="show-counter" align={'center'}>                
              <span className="odometer-block">
                  <p className='seedsale-text'>Refund Z2I</p>
              </span>
          </div>
        </Grid>
        <Grid item xs={12} lg={3}>

        </Grid>
        <Grid item xs={12} lg={4}>

        </Grid>
        <Grid item xs={12} lg={4}>
          <RefundCard contractByToken={contractByToken} />
        </Grid>
        <Grid item xs={12} lg={4}>

        </Grid>
      </Grid>
    </Main>
  );
}

export default Z2IRefund;
