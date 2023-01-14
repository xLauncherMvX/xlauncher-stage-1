import React from "react";
import Grid from "@mui/material/Grid";
import Main from "layouts/main";
import {DappUI} from '@elrondnetwork/dapp-core';

import CountdownTimer from "components/countdownTimerVXF";
import VestaXPricingCard from "cards/VestaXPricingCard";

import "assets/custom.css";
import "assets/index.css";

function VESTAXFINANCES() {
  const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;

  return (    
    <Main>
      <TransactionsToastList />
      <NotificationModal />
      <SignTransactionsModals className="custom-class-for-modals" />  
      <Grid container spacing={3} mt={-10}>
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
          <VestaXPricingCard />
        </Grid>
        <Grid item xs={12} lg={4}>

        </Grid>
      </Grid>
    </Main>
  );
}

export default VESTAXFINANCES;
