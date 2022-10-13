import DateCountdown from "components/dateCountdownPublic";
import React, {useState, useEffect} from 'react';
import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

import xConfigs from 'configs/z2iPublicConfig.json';
import "assets/custom.css";
import "assets/index.css";



export default function CountdownTimer(){
    const { address } = useGetAccountInfo();
    const isLoggedIn = Boolean(address);

    //Config Variables
    let xApiResponse = xConfigs["apiResponse"];
    let xMaxBalance = xConfigs["maxBalance"];
    let xDate = xConfigs["date"];
    let xTokenName = xConfigs["tokenName"];
    let tokenMultiplier = 1000000000000000000;

    //Query the smart contract to get the amount of token
    const [contractBalance, setContractBalance] = useState(0);
    const getContractBalance = async () => {
        try {
            const response = await fetch(xApiResponse, { 
                headers: {
                    'Accept': 'application/json',
                }
            });
            const json = await response.json();
            setContractBalance(json.balance);
        } catch (error) {
            console.error(error);
        } 
    }

    var maxBalance = xMaxBalance;
    var maxBalanceFixed = new Intl.NumberFormat('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(maxBalance);
    var balanceLeft = maxBalance + 1 - (contractBalance/tokenMultiplier);

    if(balanceLeft < 0 || !balanceLeft){
        balanceLeft = 0;
    }
    var procents = balanceLeft * 100 / maxBalance;
    var procentsOneDigit = 0;
    procentsOneDigit = parseFloat(procents).toFixed(1);    
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
    if((contractBalance/tokenMultiplier == 0) || !contractBalance && dateReached){
        collected = true;
    }

    let displayTimer;  
    if(dateReached){
        if(!collected){
            if(balanceLeft+1 >= maxBalance){
                displayTimer =
                    <div className="show-counter" align={'center'}>                
                        <span className="odometer-block">
                            <p className='seedsale-text'>Sold out</p>
                        </span>
                        <VuiProgress variant="gradient" value={procentsOneDigit} color='success'/>
                        <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {maxBalanceFixed} {xTokenName} sold</VuiTypography>
                    </div>
                ;
            }else{
                displayTimer = 
                    <div className="show-counter">                
                        <a className="countdown-link">
                            <DateCountdown dateTo={xDate}/>
                        </a>   
                        <VuiProgress variant="gradient" value={procentsOneDigit} color='success'/>
                        <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {maxBalanceFixed} {xTokenName} sold</VuiTypography>
                    </div>
                ;
            }
        }else{
            displayTimer =
            <div className="show-counter" align={'center'}>                
                <span className="odometer-block">
                    <p className='seedsale-text'>Public Sale Ended</p>
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
                    <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {maxBalanceFixed} {xTokenName} sold</VuiTypography>
                </div>
            ;
    }

    useEffect(() => {
        getContractBalance();
        getDateReached();
    }, [isLoggedIn]);  

    const MINUTE_MS = 1000;
    useEffect(() => {   
        const interval = window.setInterval(() => {    
            getContractBalance();  
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