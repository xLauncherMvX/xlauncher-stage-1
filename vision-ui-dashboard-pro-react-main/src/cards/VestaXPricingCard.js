import React, {useState, useEffect} from 'react';
import {transactionServices, useGetAccountInfo, useGetPendingTransactions} from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  AddressValue,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi
} from "@elrondnetwork/erdjs/out";
import xConfigs from 'configs/vestaXFinanceConfig.json';

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
import VuiInput from "components/VuiInput";
import Slider from "@mui/material/Slider";

import {getViewSettings, mintFunction} from "utils/apiVestaXFinance";
import {egldMultiplier, calc2} from "utils/utils";

export default function VestaXPricingCard() {
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const trans = useGetPendingTransactions().hasPendingTransactions;
  const { sendTransactions } = transactionServices;

  //Config Variables
  let provider = xConfigs['provider'];
  let mintAddress = xConfigs["mintAddress"];
  let xDate = xConfigs["date"];
  let totalAmount = xConfigs["totalAmount"]

  //Increase the amount of sfts + egld according to user preferences
  const [mintAmount, setMintAmount] = React.useState(1);
  const [egldAmount, setEgldAmount] = React.useState(2.85);

  //slider
  const handleSliderChangeS = (event) => {
    setMintAmount(event.target.value);
    setEgldAmount(event.target.value * 2.85);
  };

  //input
  const handleInputChangeS = (event) => {
    setMintAmount(event.target.value);
    setEgldAmount(event.target.value * 2.85);
  };

  //+/- buttons
  const increaseAmount = (amount) => {
    let newValue = mintAmount + amount;
    setMintAmount(newValue);
    setEgldAmount(newValue * 2.85);
  }

  const decreaseAmount = (amount) => {
    let newValue = mintAmount - amount;
    if(newValue > 0){
      setMintAmount(newValue);
      setEgldAmount(newValue);
    }
  }

  //Check if the connected wallet is whitelisted
  const [whitelistData, setWhitelistData] = useState(null);
  const getWhitelistData=()=>{
    fetch('whitelist.json'
        ,{
          headers : {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        .then(function(response){
          //console.log(response);
          return response.json();
        })
        .then(function(myJson) {
          //console.log(myJson);
          setWhitelistData(myJson);
        });
  }

  var whitelistSwitcher = false;
  if(isLoggedIn && whitelistData){
    whitelistData.addresses.map(name => {
      if(name === address){
        whitelistSwitcher = true;
      }
    })
  }

  useEffect(() => {
    if(isLoggedIn) {
      const interval = window.setInterval(() => {
        getWhitelistData();
      }, 3000);

      return () => window.clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, []);

  //Check if the wallet has enough egld to buy the selected sft
  var requiredEgld = true;
  var availableEgld = account.balance/egldMultiplier;
  if(egldAmount > availableEgld){
    requiredEgld = false;
  }

  //Call the smart contract view settings method
  const [viewSettings, setViewSettings] = useState({
    start_timestamp: 0,
    first_round_max_mint_amount: 0,
    first_round_total_minted_amount: 0,
    current_status: 0,
    current_timestamp: 0,
  })

  //Check if presale timestamp is smaller or equal to current timestamp
  let reachedTimestamp = false;
  if(viewSettings.start_timestamp){
    if(viewSettings.start_timestamp - viewSettings.current_timestamp <= 0){
      reachedTimestamp = true;
    }
  }

  //Check if sold out
  let soldout = false;
  if(viewSettings.first_round_max_mint_amount - viewSettings.first_round_total_minted_amount === 0){
    soldout = true;
  }

  //Buy Button Section
  var buttonShow;
  const [transactionSession, setTransactionSession] = React.useState(null);

  useEffect(() => {
      getViewSettings(provider, mintAddress, setViewSettings);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      getViewSettings(provider, mintAddress, setViewSettings);
    }, 2000);
    return () => window.clearInterval(interval);
  }, []);

  if(isLoggedIn && whitelistSwitcher && !trans && reachedTimestamp && !soldout && mintAmount){
      if(requiredEgld){
        buttonShow =
          <VuiButton
            mt={10}
            fullWidth
            color={'primary'}
            onClick={()=>mintFunction(mintAmount, mintAddress, sendTransactions, setTransactionSession)}
          >
            Mint
          </VuiButton>
        ;
      }else{
        buttonShow =
          <VuiButton
            mt={10}
            fullWidth
            color={'primary'}
          >
            Insufficient EGLD
          </VuiButton>
        ;
      }
  }else{
    buttonShow = " ";
  }

  //Change label to singular/plural
  var label = "SFT";
  if(mintAmount > 1) label = "SFTS"

  useEffect(() => {
    if(isLoggedIn) {
      getWhitelistData();
    }
  }, []);

  return (
    <Card>
      <Grid container>
        <Grid item xs={12} textAlign="center">
          <VuiBadge
            variant="contained"
            color={"dark"}
            size="sm"
            badgeContent={"VestaXFinance"}
            circular
            container
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center">
            <VuiTypography  variant="h1" color="white">
              {mintAmount} {label}
            </VuiTypography>
          </VuiBox>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox>
            <Divider light />
          </VuiBox>
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center" mt={2}>
            <VuiTypography  variant="h4" color="white">
              {calc2(egldAmount)} EGLD
            </VuiTypography>
          </VuiBox>
        </Grid>

        <Grid item xs={1} textAlign="center"> </Grid>
        <Grid item xs={10}>
          <VuiBox>
            <Divider light />
          </VuiBox>
          <VuiInput
              value={mintAmount}
              size="small"
              placeholder="Mint Amount"
              onChange={handleInputChangeS}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              disabled={false}
          />
          <Slider
              value={mintAmount}
              onChange={handleSliderChangeS}
              step={1}
              min={1}
              max={100}
          />
        </Grid>
        <Grid item xs={1} textAlign="center"> </Grid>

        <Grid item xs={1} textAlign="center"> </Grid>

        <Grid item xs={10} textAlign="center">
          <VuiBox mb={5}>
            <Divider light />
          </VuiBox>
          <Grid item xs={12}>
            <VuiButton
                fullWidth
                color='success'
                size="small"
                onClick={() => increaseAmount(1)}
            >
              <Icon>add</Icon>&nbsp;
              Buy More
            </VuiButton>
          </Grid>
          <Grid item xs={12}>
            <VuiButton
                fullWidth
                color='error'
                size="small"
                onClick={() => decreaseAmount(1)}
                sx={{marginTop: "10px"}}
            >
              <Icon fontSize="large" >remove</Icon>&nbsp;
              Buy less
            </VuiButton>
          </Grid>
        </Grid>
        <Grid item xs={1} textAlign="center"> </Grid>

        <Grid item xs={12} textAlign="center" mt={1}>
          <VuiBox mt={5} mb={5}>
            <Divider light />
          </VuiBox>
        </Grid>
        <Grid item xs={12} textAlign="center">
            {buttonShow}
        </Grid>
      </Grid>
    </Card>
  );
}
