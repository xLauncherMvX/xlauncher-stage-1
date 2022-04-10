import DateCountdown from "./hooks/dateCountdown";
import { Progress, Text } from '@chakra-ui/react';

export default function CountdownTimer(){
    // Render a countdown
    return (
        <div className="show-counter" >
            <p className='seedsale-text' align={'center'}>Seed Sale starts in:</p>
            <a className="countdown-link">
                <DateCountdown dateTo='April 17, 2022 00:00:00 GMT+03:00'/>
            </a>   
            <Progress hasStripe value={50} height='32px' colorScheme='blue' marginTop={'4'}/>
            <Text align={'center'} fontSize={'20'} fontWeight={'bold'} mt={'2'}> 0 / 13000000 XLH</Text>
        </div>
        
    );
}