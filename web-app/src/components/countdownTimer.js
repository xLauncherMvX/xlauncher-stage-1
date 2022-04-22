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
            const response = await fetch('https://api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgqdy3tyfye72r2u8ahg7wwmm7yuu48vdqt4d6q27mvjm/tokens/XLH-8daa50', { 
            //const response = await fetch('https://devnet-api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgqf2ddf4cd3ycqde6d43ulkcjh46lqa5lnpa7qaej6t9/tokens/XLH-cb26c7', { 
            //const response = await fetch('https://testnet-api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgqrvc0vklltk8us4ftcf79cm3fhx7vtm72pa7q7zql3t/tokens/XLH-0be7d1', { 
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

    var maxBalance = 8500000;
    var maxBalanceFixed = new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(maxBalance);
    var balanceLeft = maxBalance - (data/1000000000000000000);

    if(balanceLeft < 0 || !balanceLeft){
        balanceLeft = 0;
    }
    var procents = balanceLeft * 100 / maxBalance;
    var procentsOneDigit = parseFloat(procents).toFixed(1);

    var balanceLeftFixed = new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(balanceLeft);

    useEffect(() => {
        getBalance();
    }, [data]);
    
    // Render a countdown
    return (
        <Box as={Container} maxW="5xl" mt={14}>        
            <div className="show-counter">                
                <a className="countdown-link">
                    <DateCountdown dateTo='April 29, 2022 19:00:00 GMT+03:00'/>
                </a>   
                <Progress hasStripe value={procentsOneDigit} height='32px' colorScheme='blue' marginTop={'4'} marginLeft={-2} />
                <Text align={'center'} fontSize={'20'} fontWeight={'bold'} mt={'2'}> {balanceLeftFixed} / {maxBalanceFixed} XLH sold</Text>
            </div>
        </Box>
    );
}