import React, {useState, useEffect} from 'react';
import {
  refreshAccount,
  transactionServices,
  useGetAccountInfo,
  useGetPendingTransactions
} from '@elrondnetwork/dapp-core';
import { BigUIntValue, BytesValue, ContractFunction, TransactionPayload } from "@elrondnetwork/erdjs/out";
import {configs} from 'configs/xlhVestaXFinanceConfig';

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
import vestaXFinanceSilver from "assets/images/vestaXFinanceSilver.png";

import {egldMultiplier, calc1, calc2} from "utils/utils";
import {BigNumber} from "bignumber.js";
import DateCountdown from "components/dateCountdown";

import "assets/custom.css";
import "assets/index.css";
import VuiProgress from "components/VuiProgress";


export default function VestaXPricingCard() {
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const trans = useGetPendingTransactions().hasPendingTransactions;
  const { sendTransactions } = transactionServices;

  //Set the config network
  let xConfigs = configs.mainnet;

  //Config Variables
  let provider = xConfigs.provider;
  let mintAddress = xConfigs.mintAddress;
  let xDate = xConfigs.date;
  let totalAmount = xConfigs.totalAmount;
  let xApiLink = xConfigs.apiLink;
  let xToken = xConfigs.token;
  let xSft = xConfigs.sft;

  //Increase the amount of sfts + xlh according to user preferences
  const [mintAmount, setMintAmount] = React.useState(1);
  const [xlhAmount, setXlhAmount] = React.useState(8500);

  //slider
  const handleSliderChangeS = (event) => {
    setMintAmount(event.target.value);
    setXlhAmount(event.target.value * 8500);
  };

  //input
  const handleInputChangeS = (event) => {
    setMintAmount(event.target.value);
    setXlhAmount(event.target.value * 8500);
  };

  //+/- buttons
  const increaseAmount = (amount) => {
    let newValue = mintAmount + amount;
    setMintAmount(newValue);
    setXlhAmount(newValue * 8500);
  }

  const decreaseAmount = (amount) => {
    let newValue = mintAmount - amount;
    if(newValue > 0){
      setMintAmount(newValue);
      setXlhAmount(newValue * 8500);
    }
  }

  //Check if the connected wallet is whitelisted
  const [whitelistData, setWhitelistData] = useState(null);
  const getWhitelistData=()=>{
    fetch('whitelist_xlh_vestax_silver.json'
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

  let whitelistSwitcher = false;
  if(isLoggedIn && whitelistData){
    whitelistData.addresses.forEach(name => {
      if(name === address){
        whitelistSwitcher = true;
      }
    })
  }

  //Get the amount of xlh tokens existing in wallet
  const [xlhBalance, setXlhBalance] = useState(0);
  const customApi = xApiLink + address + '/tokens?size=2000';
  const getAccountXlh = async () => {
    try {
      const response = await fetch(customApi, {
        headers: {
          'Accept': 'application/json',
        }
      });
      const json = await response.json();
      json.forEach((token)=>{
        if(token.identifier === xToken){
          let newBalance = token.balance / egldMultiplier;
          setXlhBalance(newBalance);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  //Check if the wallet has enough xlh to buy the selected sft
  let requiredXlh = true;
  if(xlhAmount > xlhBalance){
    requiredXlh = false;
  }

  //Get the amount of sfts existing in the contract
  const [contractSftBalance, setContractSftBalance] = useState(0);
  const customSftApi = xApiLink + mintAddress + '/nfts?size=1000';
  const getContractSftBalance = async () => {
    try {
      const response = await fetch(customSftApi, {
        headers: {
          'Accept': 'application/json',
        }
      });
      const json = await response.json();
      json.forEach((sft)=>{
        if(sft.identifier === xSft){
          let newSftBalance = sft.balance;
          setContractSftBalance(newSftBalance);
        }
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  //Check if presale timestamp is smaller or equal to current timestamp
  let currentTimestamp = new Date();
  let presaleTimestamp = new Date(xDate);
  let reachedTimestamp = false;
  if(presaleTimestamp - currentTimestamp <= 0){
    reachedTimestamp = true;
  }

  //Check if sold out
  let soldout = false;
  if(contractSftBalance === 0){
    soldout = true;
  }

  //Change label to singular/plural
  let label = "SFT";
  if(mintAmount > 1) label = "SFTS";

  //Buy SFT Function
  const [transactionSession, setTransactionSession] = React.useState(null);
  const mintFunction = async (amount) => {
    console.log("Formatting the mint transaction");

    let finalTokenAmount = amount * egldMultiplier;
    let data = TransactionPayload.contractCall()
    .setFunction(new ContractFunction("ESDTTransfer"))
    .setArgs([
      BytesValue.fromUTF8(xToken),
      new BigUIntValue(new BigNumber(finalTokenAmount)),
      BytesValue.fromUTF8("buySft")
    ])
    .build().toString();

    const createMintTransaction = {
      value: 0,
      data: data,
      receiver: mintAddress,
      gasLimit: 20_000_000,
    };

    await refreshAccount();

    const { session } = await sendTransactions({
      transactions: [createMintTransaction],
      transactionsDisplayInfo: {
        processingMessage: "Mint Transaction",
        errorMessage: "An error has occured during Mint Transaction",
        successMessage: "Mint Transaction successful",
      },
      redirectAfterSign: false,

    });
    if (session != null) {
      console.log("session ", session);
      setTransactionSession(session);
    }
  };

  //Buy Button Section
  let buttonShow;
  if(isLoggedIn && !trans && reachedTimestamp && mintAmount && !soldout){
      if(requiredXlh){
        buttonShow =
          <VuiButton
            mt={10}
            fullWidth
            color={'primary'}
            onClick={()=>mintFunction(xlhAmount)}
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
            Insufficient XLH
          </VuiButton>
        ;
      }
  }else{
    buttonShow = " ";
  }

  //Disbable the +/- buttons and the input field if the the requirements were not met
  let disable = false;
  if(!reachedTimestamp || trans || soldout){
    disable = true;
  }

  //Calculate the number of smart contract bought sfts
  let boughtContractSfts = totalAmount - contractSftBalance;
  let aux = (boughtContractSfts * 100)/totalAmount;
  let percents = calc1(aux);

  //Countdown section
  let displayTimer =
  <div className="show-counter">
    <a className="countdown-link">
      <DateCountdown dateTo={xDate}/>
    </a>
  </div>;

  if(reachedTimestamp){
    displayTimer =
        <div className="show-counter">
          <a className="countdown-link">
            Presale open
          </a>
          <VuiProgress variant="gradient" value={percents} color='success'/>
          <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {boughtContractSfts} / {totalAmount} SFTS sold</VuiTypography>
        </div>
    ;
  }

  if(reachedTimestamp && soldout){
    displayTimer =
        <div className="show-counter">
          <a className="countdown-link">
            Sold Out
          </a>
          <VuiProgress variant="gradient" value={100} color='success'/>
          <VuiTypography variant="h5" color="white" align={'center'} mt={2}> {boughtContractSfts} / {totalAmount} SFTS sold</VuiTypography>
        </div>
    ;
  }

  //useEffect section
  useEffect(() => {
    getContractSftBalance();
    if(isLoggedIn){
      getWhitelistData();
      getAccountXlh();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      getContractSftBalance();
      if(isLoggedIn){
        getWhitelistData();
        getAccountXlh();
      }
    }, 2000);

    getContractSftBalance();
    if(isLoggedIn){
      getWhitelistData();
      getAccountXlh();
    }

    return () => clearInterval(interval);
  }, []);

  return (
      <React.Fragment>
        {/*Countdown section*/}
        <Grid container>
          <Grid item xs={12} alignItems="center" textAlign="center" mb={3}>
            <VuiBox>
              {displayTimer}
            </VuiBox>
          </Grid>
        </Grid>

        {/*Buy card section*/}
        <Card>
          <Grid container>
            <Grid item xs={12} textAlign="center">
              <VuiBox
                  component="img"
                  src={vestaXFinanceSilver}
                  width="100px"
                  height="100px"
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <VuiBadge
                variant="contained"
                color={"dark"}
                size="sm"
                badgeContent={"VestaXFinance Silver"}
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
                  {calc2(xlhAmount)} XLH
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
                  disabled={disable}
              />
              <Slider
                  value={mintAmount}
                  onChange={handleSliderChangeS}
                  step={1}
                  min={1}
                  max={100}
                  disabled={disable}
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
                    disabled={disable}
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
                    disabled={disable}
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
      </React.Fragment>
  );
}
