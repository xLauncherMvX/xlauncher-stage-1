// @mui material components
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";

import Main from "layouts/main";
import CountdownTimer from "components/countdownTimerZ2I";
import PriceCard from "cards/ZeroPricingCard";

import {
  DappUI,
  refreshAccount,
  transactionServices
} from '@elrondnetwork/dapp-core';

import xConfigs from 'configs/z2iConfig.json';
import "assets/custom.css";
import "assets/index.css";


const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;

function Z2I() {
  const { values } = breakpoints;
  let xPresaleAddress = xConfigs["presaleAddress"];

  const contractByXlh = async (egoldAmount) => {
    console.log('Time to buy z2i', egoldAmount);

    console.log("Formatting transaction");
    const createBuyingTransaction = {
      value: egoldAmount,
      data: [
        "buy",
      ].join("@"),
      receiver: xPresaleAddress,
      gasLimit: 35_000_000,
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [createBuyingTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Processing Buying transaction",
        errorMessage: "An error has occured during Buying",
        successMessage: "Buying transaction successful",
      },
      redirectAfterSign: false,
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
          <CountdownTimer/>
        </Grid>
        <Grid item xs={12} lg={3}>

        </Grid>
        <Grid item xs={12} lg={4}>

        </Grid>
        <Grid item xs={12} lg={4}>
          <PriceCard contractByXlh={contractByXlh} />
        </Grid>
        <Grid item xs={12} lg={4}>

        </Grid>
      </Grid>
    </Main>
  );
}

export default Z2I;
