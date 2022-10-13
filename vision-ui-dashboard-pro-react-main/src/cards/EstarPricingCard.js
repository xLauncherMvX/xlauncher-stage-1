import React, {useState, useEffect} from 'react';
import { useGetAccountInfo, useGetPendingTransactions } from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  AddressValue,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi,
} from "@elrondnetwork/erdjs/out";
import xConfigs from 'configs/estarGamesConfig.json';

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Slider from '@mui/material/Slider';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiBadge from "components/VuiBadge";
import VuiButton from "components/VuiButton";

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
  let xStakeAddress = xConfigs["stakeAddress"];
  let xApiResponse = xConfigs["apiResponse"];
  let xPresaleAddress = xConfigs["presaleAddress"];
  let xMaxBalance = xConfigs["maxBalance"]; 
  let xDate = xConfigs["date"];
  let egldMultiplier = 1000000000000000000;
  let estarMultiplier = 100;

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
      setContractEstarBalance(json.balance/estarMultiplier);
    } catch (error) {
      console.error(error);
    }
  }

  //Check the amount of estar already bought by client and the staked value
  const [boughtAmount, setBoughtAmount] = useState(0);
  const [clientReportData, setClientReportData] = useState(0);
  async function getBoughtAmount () {
    try {
      let provider = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(provider);

      //Bought Amount
      let addressBA = new Address(xPresaleAddress);
      const abiLocation = `${process.env.PUBLIC_URL}/xlauncher-presale3.abi.json`;
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
      setBoughtAmount(myList/estarMultiplier);

      //staked value
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
      let queryResponseCRD = await contractCRD.runQuery(provider, interactionCRD.buildQuery());
      let responseCRD = interactionCRD.interpretQueryResponse(queryResponseCRD);
      let myList2 = responseCRD.firstValue.valueOf();
      //console.log("myList " + JSON.stringify(myList, null, 2));
      let totalAmount = calc0(myList2["total_amount"]/ egldMultiplier);
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
  var nftApiLink = "https://api.elrond.com/accounts/" + address + "/nfts?size=500&search=XLHO-5135c9";
  const getAcountNFTS = async () => {
    try {
      const response = await fetch(
          nftApiLink,
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
          let nftSwitcher = item.metadata.attributes[3].value;
          switch (nftSwitcher) {
            case "rust":
              countRust += 1;
              break;
            case "bronze":
              countBronze += 1;
              break;
            case "silver":
              countSilver += 1;
              break;
            case "gold":
              countGold += 1;
              break;
            case "platinum":
              countPlatinum += 1;
              break;
            case "Orange":
              countLegendary += 1;
              break;
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

  //Calculate how much estar can be bought based on the staked xlh
  var maxStaked = clientReportData * 14500 / 4000;
  var maxNfts = (rustNFTS * 36250) + (bronzeNFTS * 72500) + (silverNFTS * 108750) + (goldNFTS * 108750) + (platinumNFTS * 145500) + (legendaryNFTS * 362500);
  var maxEstarIntermediate = maxStaked + maxNfts;
  if(maxEstarIntermediate >= 362500){
    maxEstarIntermediate = 362500;
  }
  var maxEstar = maxEstarIntermediate - boughtAmount;

  //Check if max amount of tokens were sold
  var balanceLeft = xMaxBalance - contractEstarBalance;
  if(balanceLeft < 0 || !balanceLeft){
      balanceLeft = 0;
  }

  var soldOut = false;
  if(balanceLeft >= xMaxBalance - 10){
    soldOut = true;
  }

  //Increase the amount of xlh + egld according to user preferences
  const [estarAmount, setEstarAmount] = React.useState(0);
  const [egldAmount, setEgldAmount] = React.useState(0);

  const handleSliderChange = (value) => {
    setEstarAmount(value);
    setEgldAmount(value/14500  * egldMultiplier);
  };
  const setMaxAmount = () => {
    setEstarAmount(maxEstar);
    setEgldAmount((maxEstar)/14500  * egldMultiplier);
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

  //Check if the client has enough egld to buy the selected estar amount
  var minEgld = true;
  var availableEgld = account.balance/egldMultiplier;
  var requiredEgld = egldAmount/egldMultiplier;
  if(requiredEgld > availableEgld){
    minEgld = false;
    //console.log(requiredEgld + ' < ' + availableEgld);
  }

  //Check if the min amount of estar was passed
  var estarMinAmount = false;
  if(estarAmount >= 14500){
    estarMinAmount = true;
  }

  //Check if the max amount of estar was reached
  var estarAmountReached = false;
  var maxEstarAmount = 362500 - boughtAmount;
  var desiredEstar = estarAmount;
  if(desiredEstar > maxEstarAmount){
    estarAmountReached = true;
  }

  //Disable max button if max amount of estar was bought
  var maxbutton = "";
  if(boughtAmount == maxEstar){
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
  if((contractEstarBalance == 0) || !contractEstarBalance && dateReached){
    collected = true;
  }

  //Buy Button Section
  var buttonShow;
  //if(isLoggedIn && !xlhAmountReached && whitelistSwitcher && !trans && dateReached && !soldOut){
  if(isLoggedIn && !estarAmountReached && !trans && dateReached && estarMinAmount && !soldOut){
    if(collected){
      buttonShow = " ";
    }else{
      if(!estarAmountReached){
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
      getContractEstarBalance();
      getDateReached();
      getBoughtAmount();
      getAcountNFTS();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if(isLoggedIn) {
      getContractEstarBalance();
      getDateReached();
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
        getContractEstarBalance();
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
              {estarAmount}
            </VuiTypography>
            <VuiTypography variant="h5" color="text">
              &nbsp;&nbsp; ESTAR
            </VuiTypography>
          </VuiBox>          
        </Grid>
        <Grid item xs={12} textAlign="center">
          <VuiBox>
            <Divider light />
          </VuiBox>
          <VuiBox display="flex" justifyContent="center" alignItems="center" textAlign="center" mt={2}>
            <VuiTypography  variant="h4" color="white">
            {calc3(egldAmount/egldMultiplier)} EGLD
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
            value={estarAmount}
            onChange={e => handleSliderChange(e.target.value)}
            step={1450}
            min={0}        
            max={calc0(maxEstar)}
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
