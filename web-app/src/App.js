import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import theme from './theme/defaultDark';
import ScratchBare from './components/scratchBare';
import { Outlet } from 'react-router-dom';
import { DappProvider } from '@elrondnetwork/dapp-core';

const environment = 'devnet';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <DappProvider
        environment={environment}
        customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
        completedTransactionsDelay={200}
      >
        <Grid>
          <ScratchBare />
          <VStack>
            <Outlet />
          </VStack>
        </Grid>
      </DappProvider>
    </ChakraProvider>
  );
}

export default App;
