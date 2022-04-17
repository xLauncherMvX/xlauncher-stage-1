import DateCountdown from "./hooks/dateCountdown";
import React, {useState, useEffect} from 'react';
import {
    Box,
    Container,
    Progress, 
    Text
  } from '@chakra-ui/react';

export default function CountdownTimer(){
    const [data, setData] = useState([]);

    const getBalance = async () => {
        try {
        const response = await fetch('https://devnet-api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgqf2ddf4cd3ycqde6d43ulkcjh46lqa5lnpa7qaej6t9/tokens/XLH-cb26c7', { 
            headers: {
                'Accept': 'application/json',
            }
        });
        const json = await response.json();
        setData(json.balance);
        } catch (error) {
        console.error(error);
        }
    }

    getBalance();
    
    useEffect(() => {
        getBalance();
    }, []);

    var maxBalance = 8500000;
    var balanceLeft = maxBalance - (data/1000000000000000000);
    if(balanceLeft < 0){
        balanceLeft = 0;
    }
    var procents = balanceLeft * 100 / maxBalance;
    var procentsOneDigit = parseFloat(procents).toFixed(1);
 

    console.log(balanceLeft);
    console.log(procents);
    console.log(procentsOneDigit);

    // Render a countdown
    return (
        <Box as={Container} maxW="5xl" mt={14}>        
            <div className="show-counter" >
                <p className='seedsale-text' align={'center'}>Seed Sale starts in:</p>
                <a className="countdown-link">
                    <DateCountdown dateTo='April 27, 2022 00:00:00 GMT+03:00'/>
                </a>   
                <Progress hasStripe value={procentsOneDigit} height='32px' colorScheme='blue' marginTop={'4'} marginLeft={-2} />
                <Text align={'center'} fontSize={'20'} fontWeight={'bold'} mt={'2'}> {balanceLeft} / {maxBalance} XLH sold</Text>
            </div>
        </Box>
    );
}