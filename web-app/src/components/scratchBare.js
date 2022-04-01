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

  const { WebWalletLoginButton, WalletConnectLoginButton } = DappUI;

  return (
    <Grid>
      <Flex backgroundColor={'gray.900'} padding={5}>
        <Button>
          <Link to="/home">Home</Link>
        </Button>
        <Spacer />
        <Text>--address--</Text>
        <Spacer />
        <Button>Connect</Button>
      </Flex>
      <Container>
        <Text>The rest</Text>
      </Container>
    </Grid>
  );
}
