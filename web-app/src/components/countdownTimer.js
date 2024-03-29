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
            //const response = await fetch('https://api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgqdy3tyfye72r2u8ahg7wwmm7yuu48vdqt4d6q27mvjm/tokens/XLH-8daa50', { 

            //const response = await fetch('https://devnet-api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgqf2ddf4cd3ycqde6d43ulkcjh46lqa5lnpa7qaej6t9/tokens/XLH-cb26c7', { 
            //const response = await fetch('https://devnet-api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgqhh5csdlkpxkt79zxnffrp9972tmnaq45f2ns7lsdph/tokens/XLH-4f55ab', { 

            const response = await fetch('https://testnet-api.elrond.com/accounts/erd1qqqqqqqqqqqqqpgqrvc0vklltk8us4ftcf79cm3fhx7vtm72pa7q7zql3t/tokens/XLH-0be7d1', { 
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

    var maxBalance = 4000000;
    var maxBalanceFixed = new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(maxBalance);
    var balanceLeft = maxBalance + 1 - (data/1000000000000000000);
    console.log('data ' + (data/1000000000000000000));

    if(balanceLeft < 0 || !balanceLeft){
        balanceLeft = 0;
    }
    var procents = balanceLeft * 100 / maxBalance;
    var procentsOneDigit = 0;
    procentsOneDigit = parseFloat(procents).toFixed(1);
    
    var balanceLeftFixed = new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(balanceLeft);

    //Check if countdown is over
    const [seedOpener, setOpener] = useState([false]);

    const getSeedOpen = async () => {
        const currentDate = new Date();
        const targetDate = new Date('May 04, 2022 14:53:00 GMT+03:00');
        const diff = targetDate - currentDate;
        
        if(diff <= 0){
        setOpener(true);
        }else{
        setOpener(false);
        }   
        console.log('countdown open: ' + seedOpener);      
    }

    //Check if collect function was called
    var collected = false;
    if((data/1000000000000000000 == 0) || !data){
        collected = true;
    }

    useEffect(() => {
        getBalance();
        getSeedOpen();
    }, [data]);  

    let displayTimer;  
    console.log('balanceLeft ' + balanceLeft);
    console.log('maxBalance ' + maxBalance); 
    if(seedOpener){
        if(!collected){
            if(balanceLeft >= maxBalance){
                displayTimer =
                    <div className="show-counter" align={'center'}>                
                        <span className="odometer-block">
                            <p className='seedsale-text'>Sold out</p>
                        </span>
                    </div>
                ;
            }else{
                displayTimer = 
                    <div className="show-counter">                
                        <a className="countdown-link">
                            <DateCountdown dateTo='May 04, 2022 14:53:00 GMT+03:00'/>
                        </a>   
                        <Progress hasStripe value={procentsOneDigit} height='32px' colorScheme='blue' marginTop={'4'} marginLeft={-2} />
                        {<Text align={'center'} fontSize={'20'} fontWeight={'bold'} mt={'2'}> {balanceLeftFixed} / {maxBalanceFixed} XLH sold</Text>}
                    </div>
                ;
            }
        }else{
            displayTimer =
            <div className="show-counter" align={'center'}>                
                <span className="odometer-block">
                    <p className='seedsale-text'>Sold out</p>
                </span>
            </div>
        ;
        }        
    }else{
        displayTimer = 
                <div className="show-counter">                
                    <a className="countdown-link">
                        <DateCountdown dateTo='May 04, 2022 14:53:00 GMT+03:00'/>
                    </a>   
                    <Progress hasStripe value={procentsOneDigit} height='32px' colorScheme='blue' marginTop={'4'} marginLeft={-2} />
                    {<Text align={'center'} fontSize={'20'} fontWeight={'bold'} mt={'2'}> {balanceLeftFixed} / {maxBalanceFixed} XLH sold</Text>}
                </div>
            ;
    }
        
    // Render a countdown
    return (
        <Box as={Container} maxW="5xl" mt={14}>        
            {displayTimer}
        </Box>
    );
}