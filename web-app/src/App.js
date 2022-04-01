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

function App() {
  return (
    <ChakraProvider theme={theme}>
        <Grid >
            <ScratchBare/>
          <VStack >
            <Text>
              X-launcher
            </Text>
            
          </VStack>
        </Grid>
    </ChakraProvider>
  );
}

export default App;
