import React from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  DappUI,
  refreshAccount,
  transactionServices,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
  useSignTransactions,
} from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  Balance,
  BigUIntValue,
  BytesValue,
  Interaction,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi,
} from '@elrondnetwork/erdjs/out';

import { Link } from 'react-router-dom';
import { FaEuroSign, FaGhost } from 'react-icons/fa';

const { SignTransactionsModals } = DappUI;

export default function Buy() {
  const contractByXlh = async (egoldAmount) => {
    console.log('Time to buy xlh', egoldAmount);
  };

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={200} mt={100}>
      <GridItem h="400" bg="orange.400" p={10}>
        <Text color={'black'} fontWeight="bold" textAlign={'center'}>
          Small Package
        </Text>
        <Box>
          <Center>
            <Button
              leftIcon={<FaEuroSign />}
              colorScheme={'black'}
              variant="outline"
              mt={'10'}
              onClick={()=>contractByXlh(123)}
            >
              Buy
            </Button>
          </Center>
        </Box>
      </GridItem>
      <GridItem h="400" bg="blue.400" p={10}>
        <Text color={'black'} fontWeight="bold" textAlign={'center'}>
          Medium Package
        </Text>
      </GridItem>
      <GridItem h="400" bg="green.500" p={10}>
        <Text color={'black'} fontWeight="bold" textAlign={'center'}>
          Large Package
        </Text>
      </GridItem>
    </Grid>
  );
}
