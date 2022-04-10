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
import { DappUI, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import '@elrondnetwork/dapp-core/build/index.css';
import '../styles.css';

export default function ConnectPage() {
  const { address} = useGetAccountInfo();
  const isLoggedIn = Boolean(address);

  const { 
    WebWalletLoginButton, 
    WalletConnectLoginButton,
    LedgerLoginButton
  } = DappUI;


  let connectSection = 
    <VStack marginTop={100} marginBottom={100}>
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
    </VStack>;

  let connectLoggedinSection = " ";
  if(!isLoggedIn){
    connectLoggedinSection = connectSection;
  }

  return (
    <Grid padding={4}>
      
        {connectLoggedinSection}
     
    </Grid>
  );
}
