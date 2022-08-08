import React, {useState, useEffect} from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { DappUI, useGetAccountInfo, useGetPendingTransactions } from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  AddressValue,
  Balance,
  BigUIntValue,
  BytesValue,
  Interaction,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi,
  TransactionPayload,
  ContractFunction
} from "@elrondnetwork/erdjs/out";
import xConfigs from 'configs/z2iPublicConfig.json';

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

export default function PricingCard({ contractByToken }) {
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const trans = useGetPendingTransactions().hasPendingTransactions;

  //Config Variables
  let xProvider = xConfigs['provider'];
  let xToken = xConfigs["token"];
  let xApiLink = xConfigs["apiLink"];
  let xApiResponse = xConfigs["apiResponse"];
  let xPresaleAddress = xConfigs["presaleAddress"];
  let xMaxBalance = xConfigs["maxBalance"]; 
  let xDate = xConfigs["date"];
  let xStartingTokenAmount = xConfigs["startingTokenAmount"];
  let xStartingEGLDAmount = xConfigs["startingEGLDAmount"];
  let xIncreasingTokenAmount = xConfigs["increasingTokenAmount"];
  let xIncreasingEGLDAmount = xConfigs["increasingEGLDAmount"];
  let xMinTokenAmount = xConfigs["minTokenAmount"];
  let xMinEGLDAmount = xConfigs["minEGLDAmount"];
  let xMaxTokenAmount = xConfigs["maxTokenAmount"];
  let xMaxEGLDAmount = xConfigs["maxEGLDAmount"];
  let xTokenName = xConfigs["tokenName"];
  let xLabel = xConfigs["label"];

  //Get token balance
  const [accountBalance, setAccountBalance] = useState(0); 
  const customApi = xApiLink+address+'/tokens/'+xToken;
  const getAccountBalance = async () => {
      try {
      const response = await fetch(customApi, { 
          headers: {
              'Accept': 'application/json',
          }
      });
      const json = await response.json();
      setAccountBalance(json.balance);
      } catch (error) {
      console.error(error);
      }
  }

  var balanceToken = accountBalance/1000000000000000000;
  if(!balanceToken){
    balanceToken = 0;
  }

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

  //Check the amount of token already bought by client
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
      setBoughtAmount(myList/1000000000000000000);

    } catch (error) {
      console.log(error);
    }
  };

  //Check if max amount of tokens were sold
  var balanceLeft = xMaxBalance - (contractBalance/1000000000000000000);
  if(balanceLeft < 0 || !balanceLeft){
      balanceLeft = 0;
  }
  var soldOut = false;
  if(balanceLeft >= xMaxBalance - 10){
    soldOut = true;
  }
  
  //Increase the amount of token + egld according to user preferences
  const [tokenAmount, setTokenAmount] = React.useState(xStartingTokenAmount);
  const [egldAmount, setEgldAmount] = React.useState(xStartingEGLDAmount);

  const increaseAmount = () => {
    let tokenInc = xIncreasingTokenAmount;
    let newTokenVal = tokenAmount + tokenInc;
    if(newTokenVal <= xMaxTokenAmount - boughtAmount){ 
      setTokenAmount(newTokenVal);
    }

    let egldInc = xIncreasingEGLDAmount;
    let newEgldVal = egldAmount + egldInc;
    if((newEgldVal <= xMaxEGLDAmount) && (newTokenVal <= xMaxTokenAmount - boughtAmount)){ 
      setEgldAmount(newEgldVal);
    }    
    console.log('Time to increase');
  };

  //Decrease the amount of token + egld according to user preferences
  const decreaseAmount = () => {
    let egldInc = xIncreasingEGLDAmount;
    let newEgldVal = egldAmount - egldInc;
    if(newEgldVal >= xMinEGLDAmount){      
      setEgldAmount(newEgldVal);
    }
    
    let tokenInc = xIncreasingTokenAmount;
    let newTokenVal = tokenAmount - tokenInc;
    if(newTokenVal >= xMinTokenAmount){ 
      setTokenAmount(newTokenVal);
    }
    console.log('Time to decrease');
  };

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

  //Check if the client has enough egld to buy the selected token amount
  var minEgld = true;
  var availableEgld = account.balance/1000000000000000000;
  var requiredEgld = egldAmount/1000000000000000000;  
  if(requiredEgld > availableEgld){
    minEgld = false;
    //console.log(requiredEgld + ' < ' + availableEgld);
  }  

  //Check if the max amount of token was reached
  var tokenAmountReached = false;
  var maxTokenAmount = xMaxTokenAmount - boughtAmount;
  var desiredToken = tokenAmount;
  if(desiredToken > maxTokenAmount){
    tokenAmountReached = true;
  }  

  //Check if collect function was called
  var collected = false;
  if((contractBalance/1000000000000000000 == 0) || !contractBalance && dateReached){
    collected = true;
  }

  //Buy Button Section
  var buttonShow;
  if(isLoggedIn && !tokenAmountReached && !trans && dateReached && !soldOut){
    if(collected){
      buttonShow = "";
    }else{
      if(!tokenAmountReached){
        if(minEgld){
          buttonShow = 
            <VuiButton
              mt={10}
              fullWidth              
              color={'primary'}
              onClick={()=>contractByToken(egldAmount)}
            >
              Buy {xTokenName}
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
            {xTokenName} Limit Exceeded
          </VuiButton>
        ;
      }      
    }
  }else{
    buttonShow = " ";
  }
    
  useEffect(() => {    
    if(isLoggedIn) {
      getAccountBalance();
      getContractBalance();
      getDateReached();
    }
  }, [isLoggedIn]);

  useEffect(() => {    
    if(isLoggedIn) {
      getAccountBalance();
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
        getAccountBalance();
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
            badgeContent={xLabel}
            circular
            container
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center">
            <VuiTypography  variant="h1" color="white">
              {tokenAmount}
            </VuiTypography>
            <VuiTypography variant="h5" color="text">
              &nbsp;&nbsp; {xTokenName}
            </VuiTypography>
          </VuiBox>          
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox>
            <Divider light />
          </VuiBox>
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center" mt={2}>
            <VuiTypography  variant="h4" color="white">
              {egldAmount/1000000000000000000} EGLD
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
