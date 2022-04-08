import React from "react";
import ReactDOM from "react-dom";
import Countdown from "react-countdown";
import { useState, useEffect } from "react";
import DateTimeDisplay from './DateTimeDisplay';
import { Progress, Text } from '@chakra-ui/react';
import './../styles.css';

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = ({ days, hours, minutes, seconds, completed }) => {
 
    // Render a countdown
    return (
        <div className="show-counter">
            <p className='seedsale-text' align={'center'}>Seed Sale starts in:</p>
            <a className="countdown-link">
                <DateTimeDisplay value={days} type={'Days'} isDanger={days <= 3} />
                <p>:</p>
                <DateTimeDisplay value={hours} type={'Hours'} isDanger={false} />
                <p>:</p>
                <DateTimeDisplay value={minutes} type={'Mins'} isDanger={false} />
                <p>:</p>
                <DateTimeDisplay value={seconds} type={'Seconds'} isDanger={false} />
            </a>
            <Progress hasStripe value={0} size={'lg'} colorScheme='blue' marginTop={'4'}/>
            <Text align={'center'} fontSize={'20'} fontWeight={'bold'} mt={'2'}> 0 / 13000000 XLH</Text>
        </div>
    );
  
};

const getLocalStorageValue = (s) => localStorage.getItem(s);

export default function LocalStorageCountdown(){
    const [data, setData] = useState(
        { date: Date.now(), delay: 604800000 } //60 seconds
        
      );
      const wantedDelay = 604800000; //60 ms
    
      //[START] componentDidMount
      //Code runs only one time after each reloading
      useEffect(() => {
        const savedDate = getLocalStorageValue("end_date");
        if (savedDate != null && !isNaN(savedDate)) {
          const currentTime = Date.now();
          const delta = parseInt(savedDate, 10) - currentTime;
    
          //Do you reach the end?
          if (delta > wantedDelay) {
            //Yes we clear uour saved end date
            if (localStorage.getItem("end_date").length > 0)
              localStorage.removeItem("end_date");
          } else {
            //No update the end date with the current date
            setData({ date: currentTime, delay: delta });
          }
        }
      }, []);
      //[END] componentDidMount
    
      return (
        <div>
          <Countdown
            date={data.date + data.delay}
            renderer={renderer}
            onStart={(delta) => {
              //Save the end date
              if (localStorage.getItem("end_date") == null)
                localStorage.setItem(
                  "end_date",
                  JSON.stringify(data.date + data.delay)
                );
            }}
            onComplete={() => {
              if (localStorage.getItem("end_date") != null)
                localStorage.removeItem("end_date");
            }}
          />
        </div>
      );

};
