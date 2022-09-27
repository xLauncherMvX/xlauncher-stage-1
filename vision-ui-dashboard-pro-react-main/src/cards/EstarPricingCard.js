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
import xConfigs from 'configs/estarGamesConfig.json';

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
function calc3(theform) {
  var with3Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  return parseFloat(with3Decimals);
}
export default function EstarPricingCard({ contractByXlh }) {
  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  const trans = useGetPendingTransactions().hasPendingTransactions;

  //Config Variables
  let xProvider = xConfigs['provider'];
  let xToken = xConfigs["token"];
  let xToken2 = xConfigs["presaleToken"];
  let xStakeAddress = xConfigs["stakeAddress"];
  let xApiLink = xConfigs["apiLink"];
  let xApiResponse = xConfigs["apiResponse"];
  let xPresaleAddress = xConfigs["presaleAddress"];
  let xMaxBalance = xConfigs["maxBalance"]; 
  let xDate = xConfigs["date"];    

  //Get token balance
  const [accountBalance, setAccountBalance] = useState(0); 
  const customApi = xApiLink+address+'/tokens/'+xToken2;
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

  var tokenBalance = accountBalance/1000000000000000000;
  if(!tokenBalance){
    tokenBalance = 0;
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

  //Check the amount of tokens already bought by client
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

  //Check the max amount of staked xlh
  const [clientReportData, setClientReportData] = useState(0);
  const getClientReportData = async () => {
    try {
      let providerCRD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCRD);
      let addressCRD = new Address(xStakeAddress);

      const abiLocationCRD = `${process.env.PUBLIC_URL}/xlauncher-staking2.abi.json`;

      let abiRegistryCRD = await AbiRegistry.load({
        urls: [abiLocationCRD],
      });
      let abiCRD = new SmartContractAbi(abiRegistryCRD, [`XLauncherStaking`]);

      let contractCRD = new SmartContract({
        address: addressCRD,
        abi: abiCRD,
      });

      let interactionCRD = contractCRD.methods.getClientReport([
        new AddressValue(new Address(address)),
      ]);

      let queryResponseCRD = await contractCRD.runQuery(providerCRD, interactionCRD.buildQuery());

      let responseCRD = interactionCRD.interpretQueryResponse(queryResponseCRD);
      let myList = responseCRD.firstValue.valueOf();
      //console.log("myList " + JSON.stringify(myList, null, 2));

      let amountFormat = 1000000000000000000;
      let totalAmount = calc0(myList["total_amount"]/ amountFormat);
      setClientReportData(totalAmount);
    } catch (error) {
      console.log(error);
    }
  };

  //Get the nfts account amount
  const [rustNFTS, setRustNFTS] = useState(0);
  const [bronzeNFTS, setBronzeNFTS] = useState(0);
  const [silverNFTS, setSilverNFTS] = useState(0);
  const [goldNFTS, setGoldNFTS] = useState(0);
  const [platinumNFTS, setPlatinumNFTS] = useState(0);
  const [legendaryNFTS, setLegendaryNFTS] = useState(0);
  const [acountNFTs, setAcountNFTs] = useState(0);
  const getAcountNFTS = async () => {
    try {
      const response = await fetch(
          'https://api.elrond.com/accounts/erd1x97ph6udergp87pnuxll67kv82y2v7l9mzvnjrhuh69xu3k2q7cqdtj85r/nfts?size=500&search=XLHO-5135c9',
    {
        headers: {
          'Accept': 'application/json',
        }
      });
      const json = await response.json();
      let countRust = 0;
      let countBronze = 0;
      let countSilver = 0;
      let countGold = 0;
      let countPlatinum = 0;
      let countLegendary = 0;
      if(json){
        json.map(item => {
          if(item.metadata.attributes[3].value == "rust"){
            countRust += 1;
          }else if (item.metadata.attributes[3].value == "bronze"){
            countBronze += 1;
          }else if (item.metadata.attributes[3].value == "silver"){
            countSilver += 1;
          }else if (item.metadata.attributes[3].value == "gold"){
            countGold += 1;
          }else if (item.metadata.attributes[3].value == "platinum"){
            countPlatinum += 1;
          }else if (item.metadata.attributes[3].value == "orange"){
            countLegendary += 1;
          }

        })
        setRustNFTS(countRust);
        setBronzeNFTS(countBronze);
        setSilverNFTS(countSilver);
        setGoldNFTS(countGold);
        setPlatinumNFTS(countPlatinum);
        setLegendaryNFTS(countLegendary);
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  //Calculate how much z2i can be bought based on the staked xlh
  var maxStaked = clientReportData * 14500 / 4000;
  var maxNfts = (rustNFTS * 36250) + (bronzeNFTS * 72500) + (silverNFTS * 108750) + (goldNFTS * 108750) + (platinumNFTS * 145500) + (legendaryNFTS * 362500);
  var maxZ2I = maxStaked + maxNfts - boughtAmount;
  if(maxZ2I >= 362500){
    maxZ2I = 362500;
  }
  console.log("maxStaked " + maxStaked);
  console.log("maxNfts " + maxNfts);
  console.log("boughtAmount " + boughtAmount);

  //Check if max amount of tokens were sold
  var balanceLeft = xMaxBalance - (contractBalance/1000000000000000000);
  if(balanceLeft < 0 || !balanceLeft){
      balanceLeft = 0;
  }
  var soldOut = false;
  if(balanceLeft >= xMaxBalance - 10){
    soldOut = true;
  }
  
  //Increase the amount of xlh + egld according to user preferences
  const [z2iAmount, setZ2IAmount] = React.useState(0);
  const [egldAmount, setEgldAmount] = React.useState(0);

  const handleSliderChange = (value) => {
    setZ2IAmount(value);
    setEgldAmount(value/14500  * 1000000000000000000);
  };
  const setMaxAmount = () => {
    setZ2IAmount(maxZ2I);
    setEgldAmount((maxZ2I)/14500  * 1000000000000000000);
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

  //Check if the client has enough egld to buy the selected z2i amount
  var minEgld = true;
  var availableEgld = account.balance/1000000000000000000;
  var requiredEgld = egldAmount/1000000000000000000;  
  if(requiredEgld > availableEgld){
    minEgld = false;
    //console.log(requiredEgld + ' < ' + availableEgld);
  }  

  //Check if the min amount of z2i was passed
  var z2iMinAmount = false;
  if(z2iAmount >= 14500){
    z2iMinAmount = true;
  }  

  //Check if the max amount of z2i was reached
  var z2iAmountReached = false;
  var maxZ2IAmount = maxZ2I - boughtAmount;
  var desiredZ2I = z2iAmount;
  if(desiredZ2I > maxZ2IAmount){
    z2iAmountReached = true;
  }  

  //Disable max button if max amount of z2i was bought
  var maxbutton = "";
  if(boughtAmount == maxZ2I){
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

  //Check if collect function was called
  var collected = false;
  if((contractBalance/1000000000000000000 == 0) || !contractBalance && dateReached){
    collected = true;
  }

  //Buy Button Section
  var buttonShow;
  //if(isLoggedIn && !xlhAmountReached && whitelistSwitcher && !trans && dateReached && !soldOut){
  if(isLoggedIn && !z2iAmountReached && !trans && dateReached && !soldOut && z2iMinAmount){
    if(collected){
      buttonShow = "";
    }else{
      if(!z2iAmountReached){
        if(minEgld){
          buttonShow = 
            <VuiButton
              mt={10}
              fullWidth              
              color={'primary'}
              onClick={()=>contractByXlh(egldAmount)}
            >
              Buy ESTAR
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
            ESTAR Limit Exceeded
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
      getClientReportData();
      getBoughtAmount();
      getAcountNFTS();
    }
  }, [isLoggedIn]);

  useEffect(() => {    
    if(isLoggedIn) {
      getAccountBalance();
      getContractBalance();
      getDateReached();
      getClientReportData();
      getBoughtAmount();
      getAcountNFTS();
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
        getClientReportData();
        getBoughtAmount();
        //getAcountNFTS();
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
            badgeContent={"EstarGames"}
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
              &nbsp;&nbsp; Estar
            </VuiTypography>
          </VuiBox>          
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox>
            <Divider light />
          </VuiBox>
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center" mt={2}>
            <VuiTypography  variant="h4" color="white">
            {calc3(egldAmount/1000000000000000000)} EGLD
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
            step={1450}
            min={0}        
            max={calc0(maxZ2I - boughtAmount)}   
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
