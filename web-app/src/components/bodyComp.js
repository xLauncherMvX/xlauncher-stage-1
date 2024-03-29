import React from 'react';
import {
  Box,
  Container,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import {
  DappUI,
  refreshAccount,
  transactionServices,
  useGetAccountInfo
} from '@elrondnetwork/dapp-core';

import SmallPricing from './smallPricing';
import MediumPricing from './mediumPricing';
import LargePricing from './largePricing';
import '@elrondnetwork/dapp-core/build/index.css';
import '../styles.css';

const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;

export default function BodyComp() {

  const [transactionSessionId, setTransactionSessionId] = React.useState(null);
  const { address, account } = useGetAccountInfo();
  
  const contractByXlh = async (egoldAmount) => {
    console.log('Time to buy xlh', egoldAmount);

    console.log("Formatting transaction");
    const createTournamentTransaction = {
      value: egoldAmount,
      data: [
        "buy",
      ].join("@"),
      receiver:
        //"erd1qqqqqqqqqqqqqpgqdy3tyfye72r2u8ahg7wwmm7yuu48vdqt4d6q27mvjm",

        //"erd1qqqqqqqqqqqqqpgqf2ddf4cd3ycqde6d43ulkcjh46lqa5lnpa7qaej6t9",
        //"erd1qqqqqqqqqqqqqpgqhh5csdlkpxkt79zxnffrp9972tmnaq45f2ns7lsdph",


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
    <Box as={Container} maxW="5xl" mt={14} p={4}>
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals className='custom-class-for-modals' />
        <Grid
            templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
            }}
            gap={{ base: '8', sm: '12', md: '32' }}
          >
            <GridItem>
              <SmallPricing contractByXlh={contractByXlh}/>
            </GridItem>
            <GridItem>
              <MediumPricing contractByXlh={contractByXlh}/>
            </GridItem>
            <GridItem>
              <LargePricing contractByXlh={contractByXlh}/>
            </GridItem> 
        </Grid>
    </Box>
  );
}
