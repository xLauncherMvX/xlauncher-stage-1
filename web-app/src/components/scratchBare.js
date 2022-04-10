import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Spacer,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react';
import { DappUI, logout, useGetAccountInfo } from '@elrondnetwork/dapp-core';
import '@elrondnetwork/dapp-core/build/index.css';
import '../styles.css';

export default function ScratchBare() {
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const [timeToConnect, setTimeToConnect] = React.useState(false);


  const { 
    WebWalletLoginButton, 
    WalletConnectLoginButton,
    LedgerLoginButton,
    ExtensionLoginButton
  } = DappUI;

  var fls = address.slice(0,5);
  var lls = address.slice(58,62);

  let connectSection = timeToConnect ? (
    <Box as={Container} maxW="6xl" mt={14} p={4} align={'center'}>
        <Text fontSize={'2xl'} mb={10}>Pick a login method</Text>
        <Grid
            templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
            }}
            gap={{ base: '8', sm: '12', md: '16' }}
          >
            <GridItem>
              <Button minW={'210'} backgroundColor={'blue.600'}>
                <WebWalletLoginButton
                  callbackRoute="/"
                  loginButtonText={"Web wallet"}
                />
              </Button>
            </GridItem>
            <GridItem>
              <Button minW={'210'} backgroundColor={'blue.600'}>
                <LedgerLoginButton
                  loginButtonText={"Ledger"}
                  callbackRoute="/"
                />
              </Button>
            </GridItem>
            <GridItem>
              <Button minW={'210'} backgroundColor={'blue.600'}>
                <WalletConnectLoginButton
                  callbackRoute="/"
                  loginButtonText={"Maiar"}
                />
              </Button>
            </GridItem> 
            <GridItem>
              <Button minW={'210'} backgroundColor={'blue.600'} className="dapp-core-ui-component-2">
                <ExtensionLoginButton
                  callbackRoute="/"
                  loginButtonText={"Extension"}
                />
              </Button>
            </GridItem> 
        </Grid>
    </Box>
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
      <Box marginRight={'5'} className='popover-login'>
        <Popover>
          <PopoverTrigger>
            <Button>{fls}...{lls}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <DappUI.Denominate value={account.balance}/>   
            </PopoverBody>
          </PopoverContent>
        </Popover> 
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
      {connectLoggedinSection}   
    </Grid>
  );
}
