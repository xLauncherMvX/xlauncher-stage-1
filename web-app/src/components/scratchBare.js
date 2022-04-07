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

export default function ScratchBare() {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const [timeToConnect, setTimeToConnect] = React.useState(false);

  const { 
    WebWalletLoginButton, 
    WalletConnectLoginButton,
    LedgerLoginButton
  } = DappUI;

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
    <Button onClick={() => setTimeToConnect(true)}> Connect</Button>
  );

  let addressSection = isLoggedIn ? (
    <Text paddingTop={2}>My wallet: {address}</Text>
  ) : (
    ""
  );

  return (
    <Grid>
      <Flex backgroundColor={'gray.900'} padding={5}>
        <Spacer />
        {addressSection}
        <Spacer />
        {connectButton}
      </Flex>
      <Container>
        {connectLoggedinSection}
      </Container>
    </Grid>
  );
}
