import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { DappUI, logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import './../styles.css';

export default function ScratchBare() {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const [timeToConnect, setTimeToConnect] = React.useState(false);

  const { 
    WebWalletLoginButton, 
    WalletConnectLoginButton,
    LedgerLoginButton
  } = DappUI;

  var fls = address.slice(0,5);
  var lls = address.slice(58,62);

  let connectSection = timeToConnect ? (
    <VStack marginTop={50}>
      <Text>Pick a login method</Text>
      <HStack>
        <Button>
          <WebWalletLoginButton
            callbackRoute="/"
            loginButtonText={"Web wallet"}
          />
        </Button>
        <Button>
          <LedgerLoginButton
            loginButtonText={"Ledger"}
            callbackRoute="/"
          />
        </Button>
        <Button>
          <WalletConnectLoginButton
            callbackRoute="/"
            loginButtonText={"Maiar"}
          />
        </Button>
      
      </HStack>
    </VStack>
  ) : (
    ""
  );

  let connectLoggedinSection = " ";
  if(!isLoggedIn){
    connectLoggedinSection = connectSection;
  }

  let connectButton = isLoggedIn ? (
    <Button onClick={() => logout(`${window.location.origin}/`)}>
      Disconnect
    </Button>
  ) : (
    <Button className='btn btn-xs' onClick={() => setTimeToConnect(true)}> Connect</Button>
  );

  let addressSection = isLoggedIn ? (
    <Box className='account-info-custom'>
      <Text paddingTop={2}>{fls}...{lls}</Text>
    </Box>
    
  ) : (
    ""
  );

  return (
    <Grid>
      <Flex backgroundColor={'blackAlpha.700'} padding={4}>
        <Spacer />
        
        <Spacer />
        {addressSection}
        {connectButton}
      </Flex>
      <Container>
        {connectLoggedinSection}
      </Container>
    </Grid>
  );
}
