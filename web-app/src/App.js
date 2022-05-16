import React from 'react';
import {
  ChakraProvider
} from '@chakra-ui/react';
import { Logo } from './Logo';
import theme from './theme/defaultDark';
import ScratchBare from './components/scratchBare';
import BodyComp from './components/bodyComp';
import { Outlet } from 'react-router-dom';
import { DappProvider } from '@elrondnetwork/dapp-core';
import '@elrondnetwork/dapp-core/build/index.css';
import './styles.css';

//const environment = 'mainnet';
//const environment = 'devnet';
 const environment = 'testnet';

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
        <BodyComp />
        
      </DappProvider>
    </ChakraProvider>
  );
}

export default App;
