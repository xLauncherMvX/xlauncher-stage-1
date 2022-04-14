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
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

export default function Pricing({ contractByXlh }) {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);

  const [xlhAmount, setXlhAmount] = React.useState(10000);
  const [egldAmount, setEgldAmount] = React.useState(1000000000000000000);

  const increaseAmount = () => {
    let egldInc = 1000000000000000000;
    let newEgldVal = egldAmount + egldInc;
    if(newEgldVal <= 5000000000000000000){ 
      setEgldAmount(newEgldVal);
      console.log(newEgldVal);
    }

    let xlhInc = 10000;
    let newXlhVal = xlhAmount + xlhInc;
    if(newXlhVal <= 50000){ 
      setXlhAmount(newXlhVal);
      console.log(newXlhVal);
    }    
    console.log('Time to increase');
  };

  const decreaseAmount = () => {
    let egldInc = 1000000000000000000;
    let newEgldVal = egldAmount - egldInc;
    if(newEgldVal > 0){      
      setEgldAmount(newEgldVal);
      console.log(newEgldVal);
    }
    
    let xlhInc = 10000;
    let newXlhVal = xlhAmount - xlhInc;
    if(newXlhVal > 0){ 
      setXlhAmount(newXlhVal);
      console.log(newXlhVal);
    }
    console.log('Time to decrease');
  };

  let buttonShow = isLoggedIn ? (
    <Button
      onClick={()=>contractByXlh(egldAmount)}
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
  ) : ( ""
  
  );

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
            color={'white'}
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
          <Stack direction={'row'} align={'center'} justify={'center'}>
            <Text fontSize={'2xl'} fontWeight={800}>
              {egldAmount/1000000000000000000} EGLD
            </Text>
          </Stack>
        </Stack>

        <Box bg={useColorModeValue('gray.50', 'gray.900')} px={6} py={10} align={'center'}>
          <List spacing={3}>
            <ListItem>
              <Button w={'full'} onClick={() => increaseAmount()}>
                <ListIcon as={FaPlus} color="green.400"/>
                <span className='cursor-pointer'>Buy more</span>
              </Button>              
            </ListItem>
            <ListItem>
              <Button w={'full'} marginLeft={'0'} onClick={() => decreaseAmount()}>
                <ListIcon as={FaMinus} color="green.400"  marginLeft={-3} />
                <span className='cursor-pointer'>Buy less</span>
              </Button>
            </ListItem>
          </List>
          {buttonShow}            
        </Box>
      </Box>
    </Center>
  );
}
