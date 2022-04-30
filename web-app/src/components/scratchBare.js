import React, {useState, useEffect} from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
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
import './../styles.css';
import { ReactComponent as ElrondLogo } from './../logo.svg';
import CountdownTimer from './countdownTimer';

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

  const [dataAccount, setDataAccount] = useState([]);

  //mainnet
  const apiLink = 'https://api.elrond.com/accounts/';  
  const apiToken = 'XLH-8daa50';  
  const customApi = apiLink+address+'/tokens/'+apiToken;

  //devnet
  // const apiLink = 'https://devnet-api.elrond.com/accounts/';
  // const apiToken = 'XLH-cb26c7';
  // const customApi = apiLink+address+'/tokens/'+apiToken;  

  //testnet
  // const apiLink = 'https://testnet-api.elrond.com/accounts/';  
  // const apiToken = 'XLH-0be7d1';  
  // const customApi = apiLink+address+'/tokens/'+apiToken;

  const getBalanceAccount = async () => {
      try {
      const response = await fetch(customApi, { 
          headers: {
              'Accept': 'application/json',
          }
      });
      const json = await response.json();
      setDataAccount(json.balance);
      } catch (error) {
      console.error(error);
      }
  }

  getBalanceAccount();

  useEffect(() => {
    getBalanceAccount();
  });

  var balanceAccount = dataAccount/1000000000000000000;
  if(!balanceAccount){
    balanceAccount = 0;
  }

  var balanceAccountFixed = new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(balanceAccount);

  var fls = address.slice(0,5);
  var lls = address.slice(56,62);

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
              <WebWalletLoginButton 
                callbackRoute="/"
                loginButtonText={"Web wallet"}
              />              
            </GridItem>
            <GridItem>
              <LedgerLoginButton
                loginButtonText={"Ledger"}
                callbackRoute="/"
              />
            </GridItem>
            <GridItem>
              <WalletConnectLoginButton
                callbackRoute="/"
                loginButtonText={"Maiar"}
              />
            </GridItem> 
            <GridItem>
              <ExtensionLoginButton
                callbackRoute="/"
                loginButtonText={"Extension"}
                className="dapp-core-ui-component-2"
              />
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
        <Popover usePortal>
          <PopoverTrigger>
            <Button>{fls}...{lls}</Button>
          </PopoverTrigger>
          <PopoverContent width={'12rem'} backgroundColor={'#1b46c2'} borderColor={'white'}>
            <PopoverArrow backgroundColor={'white'}/>
            <PopoverCloseButton color={'white'}/>
            <PopoverBody>
              <DappUI.Denominate value={account.balance}/> 
              <Divider orientation='horizontal' mt={'1'} />  
              <Text mt={'2'}>{balanceAccountFixed} XLH</Text>
            </PopoverBody>
          </PopoverContent>
        </Popover> 
      </Box>
  ) : (
    ""
  );

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  }

  let WhitelistButton = 
  <Button 
    className='btn btn-sm'
    marginTop={'3'}
    marginRight={'4'}
    float = {'right'}
    _hover={{
      bg: 'green.500',
    }}
    _focus={{
      bg: 'green.500',
    }}
    onClick={() => openInNewTab('https://docs.google.com/spreadsheets/d/14Qwk2ZfaFqwVVVD72kigKEnYNTIeYiVK/edit#gid=1344773073')}>
      Whitelist
  </Button>;

  return (
    <div>
      <Flex backgroundColor={'blackAlpha.700'} padding={4}>
        <ElrondLogo className='elrond-logo'/>        
        <Spacer />
        {/* <Text mt={'3'} fontWeight={'bold'}>DEVNET</Text> */}
        {/* <Text mt={'3'} fontWeight={'bold'}>TESTNET</Text> */}
        <Spacer />
        {addressSection}
        {connectButton}
      </Flex>
      {WhitelistButton}
      {connectLoggedinSection}  
      <CountdownTimer /> 
    </div>
    
  );
}
