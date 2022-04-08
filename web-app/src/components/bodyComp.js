import React from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  DappUI,
  refreshAccount,
  transactionServices,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
  useSignTransactions,
} from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  Balance,
  BigUIntValue,
  BytesValue,
  Interaction,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi,
} from '@elrondnetwork/erdjs/out';

import { Link } from 'react-router-dom';
import { FaEuroSign, FaGhost } from 'react-icons/fa';
import SmallPricing from './smallPricing';
import MediumPricing from './mediumPricing';
import LargePricing from './largePricing';
import '@elrondnetwork/dapp-core/build/index.css';
import './../styles.css';

const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;

export default function BodyComp() {

  const [transactionSessionId, setTransactionSessionId] = React.useState(null);


  const contractByXlh = async (egoldAmount) => {
    console.log('Time to buy xlh', egoldAmount);

    console.log("Formatting transaction");
    const createTournamentTransaction = {
      value: egoldAmount,
      data: [
        "buy",
      ].join("@"),
      receiver:
        "erd1qqqqqqqqqqqqqpgqrvc0vklltk8us4ftcf79cm3fhx7vtm72pa7q7zql3t",
      gasLimit: 10_000_000,
    };

    await refreshAccount();

    const { sessionId /*, error*/ } = await sendTransactions({
      transactions: [createTournamentTransaction],
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

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={200} mt={100}>
        <GridItem>
            <SmallPricing contractByXlh={contractByXlh}/>
        </GridItem> 
        <GridItem>
            <MediumPricing contractByXlh={contractByXlh}/>
        </GridItem> 
        <GridItem>
            <LargePricing contractByXlh={contractByXlh}/>
        </GridItem> 
        <SignTransactionsModals className="custom-class-for-modals" />
        <Box>
        <TransactionsToastList />
        {/* <NotificationModal /> */}
        </Box>     
    </Grid>
  );
}
