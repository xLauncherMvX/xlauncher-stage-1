import DateCountdown from "components/dateCountdown";
import React, {useState, useEffect} from 'react';
import {useGetAccountInfo } from '@elrondnetwork/dapp-core';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

import xConfigs from 'configs/estarGamesConfig.json';
import "assets/custom.css";
import "assets/index.css";

function calc1(theform) {
    var with1Decimal = theform.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
    var value = with1Decimal;
    return parseFloat(value);
}

export default function CountdownTimer(){
    const { address } = useGetAccountInfo();
    const isLoggedIn = Boolean(address);

    //Config Variables
    let xApiResponse = xConfigs["apiResponse"];
    let xMaxBalance = xConfigs["maxBalance"];
    let xDate = xConfigs["date"];
    let tokenMultiplier = 100;

    //Query the smart contract to get the amount of token
    const [contractEstarBalance, setContractEstarBalance] = useState(0);
    const getContractEstarBalance = async () => {
        try {
            const response = await fetch(xApiResponse, { 
                headers: {
                    'Accept': 'application/json',
                }
            });
            const json = await response.json();
            setContractEstarBalance(json.balance/tokenMultiplier);
        } catch (error) {
            console.error(error);
        } 
    }
    
    var xMaxBalanceFixed = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(xMaxBalance);
    var balanceLeft = xMaxBalance + 1 - contractEstarBalance;

    if(balanceLeft < 0 || !balanceLeft){
        balanceLeft = 0;
    }
    var procents = balanceLeft * 100 / xMaxBalance;
    var procentsOneDigit = calc1(procents);
    var balanceLeftFixed = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(balanceLeft);

    //Check if countdown is over
    const [dateReached, setDateReached] = useState(false);
    const getDateReached = async () => {
        const currentDate = new Date();
        const targetDate = new Date(xDate);
        const diff = targetDate - currentDate;

        if(diff <= 0){
            setDateReached(true);
        }else{
            setDateReached(false);
        }  
    }

    //Check if collect function was called
    var collected = false;
    if((contractEstarBalance == 0) || !contractEstarBalance && dateReached){
        collected = true;
    }

    let displayTimer;  
    if(dateReached){
        if(!collected){
            if(balanceLeft+1 >= xMaxBalance){
                displayTimer =
                    <div className="show-counter" align={'center'}>                
                        <span className="odometer-block">
                            <p className='seedsale-text'>Sold out</p>
                        </span>
                        <VuiProgress variant="gradient" value={procentsOneDigit} color='success'/>
                        <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {xMaxBalanceFixed} ESTAR sold</VuiTypography>
                    </div>
                ;
            }else{
                displayTimer = 
                    <div className="show-counter">                
                        <a className="countdown-link">
                            <DateCountdown dateTo={xDate}/>
                        </a>   
                        <VuiProgress variant="gradient" value={procentsOneDigit} color='success'/>
                        <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {xMaxBalanceFixed} ESTAR sold</VuiTypography>
                    </div>
                ;
            }
        }else{
            displayTimer =
            <div className="show-counter" align={'center'}>                
                <span className="odometer-block">
                    <p className='seedsale-text'>Presale Ended</p>
                </span>
            </div>
        ;
        }        
    }else{
        displayTimer = 
                <div className="show-counter">                
                    <a className="countdown-link">
                        <DateCountdown dateTo={xDate}/>
                    </a>   
                    <VuiProgress variant="gradient" value={procentsOneDigit} color='success'/>
                    <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {xMaxBalanceFixed} ESTAR sold</VuiTypography>
                </div>
            ;
    }

    useEffect(() => {
        getContractEstarBalance();
        getDateReached();
    }, [isLoggedIn]);  

    const MINUTE_MS = 1000;
    useEffect(() => {   
        const interval = window.setInterval(() => {    
            getContractEstarBalance();  
            getDateReached();
        }, MINUTE_MS);

        return () => window.clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])
        
    // Render a countdown
    return (
        <VuiBox>        
            {displayTimer}
        </VuiBox>
    );
}