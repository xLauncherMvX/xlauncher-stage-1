import React, {useState, useEffect} from 'react';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiProgress from "components/VuiProgress";

//import css styles
import "assets/custom.css";
import "assets/index.css";

import DateCountdown from "components/dateCountdown";
import xConfigs from "configs/vestaXFinanceConfig.json";
import {getViewSettings} from "utils/apiVestaXFinance";
import {calc1} from "utils/utils";

export default function CountdownTimerVXF(){
    //Config Variables
    let provider = xConfigs["provider"];
    let mintAddress = xConfigs["mintAddress"];

    const [viewSettings, setViewSettings] = useState({
        start_timestamp: 0,
        first_round_max_mint_amount: 0,
        first_round_total_minted_amount: 0,
        current_status: 0,
        current_timestamp: 0,
    })

    useEffect(() => {
        const interval = window.setInterval(() => {
            getViewSettings(provider, mintAddress, setViewSettings);
        }, 2000);
        return () => window.clearInterval(interval);
    }, [])

    let procents = 0;
    if(viewSettings.first_round_max_mint_amount){
        let aux = (viewSettings.first_round_total_minted_amount * 100)/viewSettings.first_round_max_mint_amount;
        procents = calc1(aux);
    }

    //Check if presale timestamp is smaller or equal to current timestamp
    let reachedTimestamp = false;
    if(viewSettings.start_timestamp){
        if(viewSettings.start_timestamp - viewSettings.current_timestamp <= 0){
            reachedTimestamp = true;
        }
    }

    let displayTimer =
        <div className="show-counter">
            <a className="countdown-link">
                <DateCountdown dateTo={viewSettings.start_timestamp * 1000}/>
            </a>
       </div>;

    if(reachedTimestamp){
        displayTimer =
            <div className="show-counter">
                <a className="countdown-link">
                    Presale open
                </a>
                <VuiProgress variant="gradient" value={procents} color='success'/>
                <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {viewSettings.first_round_total_minted_amount} / {viewSettings.first_round_max_mint_amount} SFTS sold</VuiTypography>
            </div>
    }

    if(viewSettings.first_round_max_mint_amount - viewSettings.first_round_total_minted_amount === 0){
        displayTimer =
            <div className="show-counter">
                <a className="countdown-link">
                    Sold out
                </a>
                <VuiProgress variant="gradient" value={100} color='success'/>
                <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {viewSettings.first_round_total_minted_amount} / {viewSettings.first_round_max_mint_amount} SFTS sold</VuiTypography>
            </div>
    }

    if(viewSettings.current_status >= 3){
        displayTimer =
            <div className="show-counter" align={'center'}>
                    <span className="odometer-block">
                        <p className='seedsale-text'>Presale Ended</p>
                    </span>
            </div>
    }
        
    // Render a countdown
    return (
        <VuiBox>        
            {displayTimer}
        </VuiBox>
    );
}