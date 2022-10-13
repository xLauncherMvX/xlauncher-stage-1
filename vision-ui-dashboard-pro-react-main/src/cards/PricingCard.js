import React, {useState, useEffect} from 'react';
import { useGetAccountInfo, useGetPendingTransactions } from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  AddressValue,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi
} from "@elrondnetwork/erdjs/out";
import xConfigs from 'configs/envConfig.json';

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

export default function PricingCard({ contractByXlh }) {
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const trans = useGetPendingTransactions().hasPendingTransactions;

  //Config Variables
  let xProvider = xConfigs['provider'];
  let xApiResponse = xConfigs["apiResponse"];
  let xPresaleAddress = xConfigs["presaleAddress"];
  let xMaxBalance = xConfigs["maxBalance"]; 
  let xDate = xConfigs["date"];
  let multiplier = 1000000000000000000;

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

  //Check the amount of xlh already bought by client
  const [boughtAmount, setBoughtAmount] = useState(0);
  const getBoughtAmount = async () => {
    try {
      let provider = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(provider);

      let addressBA = new Address(xPresaleAddress);
      const abiLocation = `${process.env.PUBLIC_URL}/xlauncher-presale.abi.json`;

      let abiRegistry = await AbiRegistry.load({
        urls: [abiLocation],
      });
      let abi = new SmartContractAbi(abiRegistry, [`XLauncherPresale`]);

      let contract = new SmartContract({
        address: addressBA,
        abi: abi,
      });

      let interaction = contract.methods.getClientBoughtValue([
        new AddressValue(new Address(address)),
      ]);

      let queryResponse = await contract.runQuery(provider, interaction.buildQuery());

      let response = interaction.interpretQueryResponse(queryResponse);
      let myList = response.firstValue.valueOf();
      //console.log("myList " + myList);
      setBoughtAmount(myList/multiplier);

    } catch (error) {
      console.log(error);
    }
  };

  

  //Check if max amount of tokens were sold
  var balanceLeft = xMaxBalance - (contractBalance/multiplier);
  if(balanceLeft < 0 || !balanceLeft){
      balanceLeft = 0;
  }
  var soldOut = false;
  if(balanceLeft >= xMaxBalance - 10){
    soldOut = true;
  }
  
  //Increase the amount of xlh + egld according to user preferences
  const [xlhAmount, setXlhAmount] = React.useState(6500);
  const [egldAmount, setEgldAmount] = React.useState(multiplier);

  const increaseAmount = () => {
    let xlhInc = 3250;
    let newXlhVal = xlhAmount + xlhInc;
    if(newXlhVal <= 32500 - boughtAmount){ 
      setXlhAmount(newXlhVal);
    }

    let egldInc = 0.5 * multiplier;
    let newEgldVal = egldAmount + egldInc;
    if((newEgldVal <= 5 * multiplier) && (newXlhVal <= 32500 - boughtAmount)){
      setEgldAmount(newEgldVal);
    }    
    console.log('Time to increase');
  };

  //Decrease the amount of xlh + egld according to user preferences
  const decreaseAmount = () => {
    let egldInc = 0.5 * multiplier;
    let newEgldVal = egldAmount - egldInc;
    if(newEgldVal >= multiplier){
      setEgldAmount(newEgldVal);
    }
    
    let xlhInc = 3250;
    let newXlhVal = xlhAmount - xlhInc;
    if(newXlhVal >= 6500){ 
      setXlhAmount(newXlhVal);
    }
    console.log('Time to decrease');
  };

  //Check if the connected wallet is whitelisted
  const [whitelistData, setWhitelistData] = useState(null);
  const getData=()=>{
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

  var whitelistVar = [];
  var whitelistSwitcher = false;
  if(!whitelistData){
    whitelistVar.addresses = [];
  }else{
    whitelistVar = whitelistData;
  }
  if(isLoggedIn){
    whitelistVar.addresses.map(name => {
      if(name == address){
        whitelistSwitcher = true;
      }
    })
  }

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

  //Check if the client has enough egld to buy the selected xlh amount
  var minEgld = true;
  var availableEgld = account.balance/multiplier;
  var requiredEgld = egldAmount/multiplier;
  if(requiredEgld > availableEgld){
    minEgld = false;
  }  

  //Check if the max amount of xlh was reached
  var xlhAmountReached = false;
  var maxXlhAmount = 32500 - boughtAmount;
  var desiredXLH = xlhAmount;
  if(desiredXLH > maxXlhAmount){
    xlhAmountReached = true;
  }  

  //Check if collect function was called
  var collected = false;
  if((contractBalance/multiplier == 0) || !contractBalance && dateReached){
    collected = true;
  }

  //Buy Button Section
  var buttonShow;
  //if(isLoggedIn && !xlhAmountReached && whitelistSwitcher && !trans && dateReached && !soldOut){
  if(isLoggedIn && !xlhAmountReached && whitelistSwitcher && !trans && dateReached && !soldOut){
    if(collected){
      buttonShow = "";
    }else{
      if(!xlhAmountReached){
        if(minEgld){
          buttonShow = 
            <VuiButton
              mt={10}
              fullWidth              
              color={'primary'}
              onClick={()=>contractByXlh(egldAmount)}
            >
              Buy XLH
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
        buttonShow = 
          <VuiButton
            mt={10}
            fullWidth              
            color={'primary'}
          >
            XLH Limit Exceeded
          </VuiButton>
        ;
      }      
    }
  }else{
    buttonShow = " ";
  }
    
  useEffect(() => {    
    if(isLoggedIn) {
      getData();
      getContractBalance();
      getDateReached();
    }
  }, [isLoggedIn]);

  useEffect(() => {    
    if(isLoggedIn) {
      getData();
      getContractBalance();
      getDateReached();
      getBoughtAmount();
    }
  }, []);

  const MINUTE_MS = 1000;
  useEffect(() => {    
    if(isLoggedIn) {
      const interval = window.setInterval(() => {      
        getDateReached();
      }, MINUTE_MS);

      return () => window.clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, []);

  const MINUTE_MS2 = 3000;
  useEffect(() => {    
    if(isLoggedIn) {
      const interval = window.setInterval(() => {      
        getData();
        getContractBalance();
        getBoughtAmount();
      }, MINUTE_MS2);

      return () => window.clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
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
            badgeContent={"XLauncher"}
            circular
            container
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center">
            <VuiTypography  variant="h1" color="white">
              {xlhAmount}
            </VuiTypography>
            <VuiTypography variant="h5" color="text">
              &nbsp;&nbsp; XLH
            </VuiTypography>
          </VuiBox>          
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox>
            <Divider light />
          </VuiBox>
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center" mt={2}>
            <VuiTypography  variant="h4" color="white">
              {egldAmount/multiplier} EGLD
            </VuiTypography>
          </VuiBox>          
        </Grid> 
        <Grid item xs={1} textAlign="center">

        </Grid>
        <Grid item xs={10} textAlign="center">
          <VuiBox mb={5}>
            <Divider light />
          </VuiBox>
          <VuiButton
            fullWidth              
            color='success'
            size="small"
            onClick={() => increaseAmount()}
          >
            <Icon>add</Icon>&nbsp;
            Buy More
          </VuiButton>
        </Grid>  
        <Grid item xs={1} textAlign="center">

        </Grid>
        <Grid item xs={1} textAlign="center">

        </Grid> 
        <Grid item xs={10} textAlign="center" mt={1}>
          <VuiButton
            fullWidth              
            color='error'
            size="small"
            onClick={() => decreaseAmount()}
          >
            <Icon fontSize="large" >remove</Icon>&nbsp;
            Buy Less&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </VuiButton>
        </Grid>
        <Grid item xs={1} textAlign="center">

        </Grid>    
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
