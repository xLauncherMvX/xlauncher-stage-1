import DateCountdown from "components/dateCountdown";
import React, {useState, useEffect} from 'react';
import { DappUI, useGetAccountInfo, useGetPendingTransactions } from '@elrondnetwork/dapp-core';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiBadge from "components/VuiBadge";
import VuiButton from "components/VuiButton";
import VuiProgress from "components/VuiProgress";

import xConfigs from 'configs/envConfig.json';
import "assets/custom.css";
import "assets/index.css";

//Config Variables
let xProvider = xConfigs['provider'];
let xToken = xConfigs["token"];
let xStakeAddress = xConfigs["stakeAddress"];
let xApiLink = xConfigs["apiLink"];
let xApiResponse = xConfigs["apiResponse"];
let xPresaleAddress = xConfigs["presaleAddress"];
let xOldStakeAddress = xConfigs["oldStakeAddress"];  
let xMaxBalance = xConfigs["maxBalance"]; 
let xDate = xConfigs["date"];   

export default function CountdownTimer(){
    const { address, account } = useGetAccountInfo();
    const isLoggedIn = Boolean(address);

    //Query the smart contract to get the amount of xlh
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

    var maxBalance = 8500000;
    var maxBalanceFixed = new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(maxBalance);
    var balanceLeft = maxBalance + 1 - (contractBalance/1000000000000000000);

    if(balanceLeft < 0 || !balanceLeft){
        balanceLeft = 0;
    }
    var procents = balanceLeft * 100 / maxBalance;
    var procentsOneDigit = 0;
    procentsOneDigit = parseFloat(procents).toFixed(1);    
    var balanceLeftFixed = new Intl.NumberFormat('ro-Ro', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(balanceLeft);

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
    if((contractBalance/1000000000000000000 == 0) || !contractBalance && dateReached){
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
                        <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {maxBalanceFixed} XLH sold</VuiTypography>
                    </div>
                ;
            }else{
                displayTimer = 
                    <div className="show-counter">                
                        <a className="countdown-link">
                            <DateCountdown dateTo={xDate}/>
                        </a>   
                        <VuiProgress variant="gradient" value={procentsOneDigit} color='success'/>
                        <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {maxBalanceFixed} XLH sold</VuiTypography>
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
                    <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {balanceLeftFixed} / {maxBalanceFixed} XLH sold</VuiTypography>
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