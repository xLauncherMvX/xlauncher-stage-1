import React from 'react';
import {
  ChakraProvider
} from '@chakra-ui/react';
import theme from './../theme/defaultDark';
import ScratchBare from './scratchBare';
import BodyComp from './bodyComp';
import CountdownTimer from './countdownTimer';
import { Outlet } from 'react-router-dom';
import { DappProvider } from '@elrondnetwork/dapp-core';
import '@elrondnetwork/dapp-core/build/index.css';
import './../styles.css';

const environment = 'devnet';

function Unlock() {
  return (
    <ChakraProvider theme={theme}>
      <DappProvider
        environment={environment}
        customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
        completedTransactionsDelay={200}
      >
        <ScratchBare />
        <Outlet />        
        <CountdownTimer/>
        <BodyComp />
        
      </DappProvider>
    </ChakraProvider>
  );
}

export default Unlock;
