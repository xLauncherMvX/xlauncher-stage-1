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
import xConfigs from 'configs/z2iRefundConfig.json';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Slider from '@mui/material/Slider';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiBadge from "components/VuiBadge";
import VuiButton from "components/VuiButton";
import VuiInput from "components/VuiInput";


function calc0(theform) {
  var with1Decimal = theform.toString().match(/^-?\d+(?:\\d{0})?/)[0];
  var value = with1Decimal;
  return parseFloat(value);
}

export default function RefundCardZ2I({ contractByToken }) {
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const trans = useGetPendingTransactions().hasPendingTransactions;

  //Config Variables
  let xProvider = xConfigs['provider'];
  let xToken = xConfigs["token"];
  let xPresaleAddress = xConfigs["presaleAddress"]; 
  let xApiLink = xConfigs["apiLink"];

  //Check the amount of z2i bought by client
  const [boughtAmount, setBoughtAmount] = useState(0);
  const getBoughtAmount = async () => {
    try {
      let provider = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(provider);

      let addressBA = new Address(xPresaleAddress);
      const abiLocation = `${process.env.PUBLIC_URL}/xlauncher-presale2.abi.json`;

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

  //Check the amount of z2i refunded by client
  const [refundedAmount, setRefundedAmount] = useState(0);
  const getRefundedAmount = async () => {
    try {
      let provider = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(provider);

      let addressBA = new Address(xPresaleAddress);
      const abiLocation = `${process.env.PUBLIC_URL}/xlauncher-presale2.abi.json`;

      let abiRegistry = await AbiRegistry.load({
        urls: [abiLocation],
      });
      let abi = new SmartContractAbi(abiRegistry, [`XLauncherPresale`]);

      let contract = new SmartContract({
        address: addressBA,
        abi: abi,
      });

      let interaction = contract.methods.clientBuybackValue([
        new AddressValue(new Address(address)),
      ]);

      let queryResponse = await contract.runQuery(provider, interaction.buildQuery());

      let response = interaction.interpretQueryResponse(queryResponse);
      let myList = response.firstValue.valueOf();
      //console.log("myList " + myList);
      setRefundedAmount(myList/1000000000000000000);

    } catch (error) {
      console.log(error);
    }
  };
  
  //Get the amount of tokens existing in wallet
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

  //Increase the amount of toekn + egld according to user preferences
  const [z2iAmount, setZ2IAmount] = React.useState(0);
  const [egldAmount, setEgldAmount] = React.useState(0);

  const handleSliderChange = (value) => {
    setZ2IAmount(value);
    setEgldAmount(value * 1000000000000000);
  };

  var aux = calc0(boughtAmount - refundedAmount);
  if(balanceToken < aux){
    aux = balanceToken;
  }
  const setMaxAmount = () => {
    setZ2IAmount(aux);
    setEgldAmount(aux * 1000000000000000);
  };

  //Check if the wallet has the required tokens
  // var tokensInWallet = false;
  // if(z2iAmount <= accountBalance){
  //   tokensInWallet = true;
  // }

  //Disable max button if max amount of z2i was bought
  var maxbutton = "";
  if((refundedAmount == boughtAmount) || trans){
    maxbutton=
      <VuiButton
          variant="outlined"
          color="light"
          size="small"
          disabled={true}
          fullWidth
        >
          Max
      </VuiButton>
    ;    
  }else{
    maxbutton=
      <VuiButton
          variant="outlined"
          color="light"
          size="small"
          onClick={() => setMaxAmount()}
          fullWidth
        >
          Max
      </VuiButton>
    ;
  }

  //Buy Button Section
  var buttonShow;
  if(isLoggedIn && !trans && aux){
    buttonShow = 
      <VuiButton
        mt={10}
        fullWidth              
        color={'primary'}
        onClick={()=>contractByToken(z2iAmount)}
      >
        Refund Z2I
      </VuiButton>
    ;  
  }else{
    buttonShow = " ";
  }
    
  useEffect(() => {    
    if(isLoggedIn) {
      getBoughtAmount();
      getRefundedAmount();
      getAccountBalance();
    }
  }, [isLoggedIn]);

  useEffect(() => {    
    if(isLoggedIn) {
      getBoughtAmount();
      getRefundedAmount();
      getAccountBalance();
    }
  }, []);

  const MINUTE_MS = 3000;
  useEffect(() => {    
    if(isLoggedIn) {
      const interval = window.setInterval(() => {   
        getBoughtAmount();
        getRefundedAmount();
        getAccountBalance();
      }, MINUTE_MS);

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
            badgeContent={"Zero2Infinity"}
            circular
            container
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center">
            <VuiTypography  variant="h1" color="white">
              {z2iAmount}
            </VuiTypography>
            <VuiTypography variant="h5" color="text">
              &nbsp;&nbsp; Z2I
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
          <Slider
            value={z2iAmount}
            onChange={e => handleSliderChange(e.target.value)}
            step={50}
            min={0}        
            max={aux}   
          />        
        </Grid>  
        <Grid item xs={1} textAlign="center">

        </Grid>

        <Grid item xs={4} textAlign="center">

        </Grid>
        <Grid item xs={4} textAlign="center">
          {maxbutton}
        </Grid>
        <Grid item xs={4} textAlign="center">

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
