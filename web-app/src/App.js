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
import theme from "./theme/defaultDark";
import ScratchBare from './components/scratchBare';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <ChakraProvider theme={theme}>
        <Grid >
            <ScratchBare/>
          <VStack >
          <Outlet/>
          </VStack>
        </Grid>
    </ChakraProvider>
  );
}

export default App;
