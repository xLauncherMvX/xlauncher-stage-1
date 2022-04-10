import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  GridItem,
  HStack,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import theme from './theme/defaultDark';
import ScratchBare from './components/scratchBare';
import BodyComp from './components/bodyComp';
import CountdownTimer from './components/countdownTimer';
import { Outlet } from 'react-router-dom';
import { DappProvider } from '@elrondnetwork/dapp-core';
import '@elrondnetwork/dapp-core/build/index.css';
import './styles.css';

const environment = 'devnet';

function App() {
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

export default App;
