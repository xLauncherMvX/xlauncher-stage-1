import React from "react";
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
} from "@chakra-ui/react";


export default function ScratchBare() {

  return (
    <Grid>
      <Flex backgroundColor={"gray.900"} padding={5}>
        <Button disabled={true}>Home</Button>
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
