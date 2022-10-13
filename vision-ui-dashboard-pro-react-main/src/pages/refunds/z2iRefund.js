// @mui material components
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";

import Main from "layouts/main";
import RefundCard from "cards/RefundCardZ2I";

import {
  DappUI,
  refreshAccount,
  transactionServices
} from '@elrondnetwork/dapp-core';
import {
  BigUIntValue,
  BytesValue,
  TransactionPayload,
  ContractFunction
} from "@elrondnetwork/erdjs/out";
import {BigNumber} from "bignumber.js"

import xConfigs from 'configs/z2iRefundConfig.json';
import "assets/custom.css";
import "assets/index.css";

const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;

function Z2IRefund() {
  const { values } = breakpoints;
  let xPresaleAddress = xConfigs["presaleAddress"];
  let xToken = xConfigs["token"];

  const contractByToken = async (tokenAmount) => {
    console.log("Formatting refund transaction");

    let multiplier = 1000000000000000000;
    let finalTokenAmount = tokenAmount * multiplier;
    let SData = TransactionPayload.contractCall()
    .setFunction(new ContractFunction("ESDTTransfer"))
    .setArgs([
        BytesValue.fromUTF8(xToken),
        new BigUIntValue(new BigNumber(finalTokenAmount)),
        BytesValue.fromUTF8("buyback")
    ])
    .build().toString();

    const createRefundTransaction = {
      value: "0",
      data: SData,
      receiver: xPresaleAddress,
      gasLimit: 8000000,
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [createRefundTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Refund Transaction",
        errorMessage: "An error has occured during Refund Transaction",
        successMessage: "Refund Transaction successful",
      },
      redirectAfterSign: true,
      callbackRoute: '/#/refunds/z2iRefund'
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
