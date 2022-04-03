import React from 'react';
import {
  Box,
  Center,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckIcon, MinusIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { FaPlus } from 'react-icons/fa';

export default function Pricing() {
  const [xlhAmount, setXlhAmount] = React.useState(6250);
  const [egldAmount, setEgldAmount] = React.useState(250000000000000000);
  const [egldDisplay, setEgldDisplay] = React.useState(0.26);

  const inclementAmount = () => {
    let egldInc = 250000000000000000;
    let newEgldVal = egldAmount + egldInc;
    setEgldAmount(newEgldVal);

    let xlhInc = 6250;
    let newXlhVal = xlhAmount + xlhInc;
    setXlhAmount(newXlhVal);
    console.log('Time to increment');
  };

  return (
    <Center py={6}>
      <Box
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}
      >
        <Stack
          textAlign={'center'}
          p={6}
          color={useColorModeValue('gray.800', 'white')}
          align={'center'}
        >
          <Text
            fontSize={'sm'}
            fontWeight={500}
            bg={useColorModeValue('green.50', 'green.900')}
            p={2}
            px={3}
            color={'green.500'}
            rounded={'full'}
          >
            $XLH
          </Text>
          <Stack direction={'row'} align={'center'} justify={'center'}>
            <Text fontSize={'3xl'}></Text>
            <Text fontSize={'6xl'} fontWeight={800}>
              {xlhAmount}
            </Text>
            <Text color={'gray.500'}> XLH</Text>
          </Stack>
        </Stack>

        <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={10}>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckIcon} color="green.400" />
              {egldAmount}
            </ListItem>
            
            <ListItem>
              <ListIcon as={FaPlus} color="green.400" />
              <span onClick={() => inclementAmount()}>Buy more</span>
            </ListItem>
            <ListItem>
              <ListIcon as={MinusIcon} color="green.400" />
              Buy less
            </ListItem>
          </List>

          <Button
            mt={10}
            w={'full'}
            bg={'green.400'}
            color={'white'}
            rounded={'xl'}
            boxShadow={'0 5px 20px 0px rgb(72 187 120 / 43%)'}
            _hover={{
              bg: 'green.500',
            }}
            _focus={{
              bg: 'green.500',
            }}
          >
            Buy XLH
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
