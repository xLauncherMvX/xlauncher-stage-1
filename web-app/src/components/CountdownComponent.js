import React from 'react';
import CountdownTimer from './CountdownTimer';
import { Progress, Text } from '@chakra-ui/react';

import '../custom.css';

export default function CountdownComponent() {
  const THREE_DAYS_IN_MS = 13 * 24 * 60 * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;

  return (
    <div className='center-countdown'>
      <p className='seedsale-text'>Seed Sale starts in:</p>
      <CountdownTimer targetDate={dateTimeAfterThreeDays} />
      <Progress hasStripe value={10} size={'lg'} colorScheme='blue' marginTop={'4'}/>
      <Text fontSize={'20'} fontWeight={'bold'} mt={'2'}> 0 / 13000000 XLH</Text>
    </div>
  );
}