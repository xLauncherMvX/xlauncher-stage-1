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

export default function Home() {
  return (
    <Container>
      <Text>Home</Text>
      <Button>
        <Link to="/">Landing page</Link>
      </Button>
    </Container>
  );
}
