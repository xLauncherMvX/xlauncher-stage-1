import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  HStack,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import theme from './theme/defaultDark';
import ScratchBare from './components/scratchBare';
import BodyComp from './components/bodyComp';
import CountdownComponent from './components/CountdownComponent';
import { Outlet } from 'react-router-dom';
import { DappProvider } from '@elrondnetwork/dapp-core';
import './custom.css';

const environment = 'devnet';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <DappProvider
        environment={environment}
        customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
        completedTransactionsDelay={200}
      >
        <Grid backgroundImage={
          'url(https://x-launcher.com/wp-content/uploads/2022/03/roadmap4-scaled.jpg)'
        }
        backgroundSize={'cover'}
        backgroundPosition={'center'}
        backgroundRepeat={'repeat'}>
          <ScratchBare />
          <VStack>
            <Outlet />
          </VStack>
          <VStack>
            <HStack>
              <CountdownComponent />
            </HStack>    
            <HStack>
            <BodyComp />
            </HStack>    
          </VStack>
         
        </Grid>
      </DappProvider>
    </ChakraProvider>
  );
}

export default App;
