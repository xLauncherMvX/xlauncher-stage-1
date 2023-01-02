import React, {useEffect, useState} from "react";
import {CSVLink} from "react-csv";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import VuiButton from "components/VuiButton";
import VuiTypography from "components/VuiTypography";


import {
  DappUI,
  refreshAccount,
  useGetAccountInfo,
  transactionServices
} from '@elrondnetwork/dapp-core';
import {
  AbiRegistry,
  Address,
  AddressValue,
  NetworkConfig,
  ProxyProvider,
  SmartContract,
  SmartContractAbi
} from "@elrondnetwork/erdjs/out";

import Main from "layouts/main";
import xConfigs from 'configs/envConfig.json';
import "assets/custom.css";
import "assets/index.css";

const { SignTransactionsModals, TransactionsToastList, NotificationModal } = DappUI;
const { sendTransactions } = transactionServices;

function calc0(theform) {
  var value = theform.toString().match(/^-?\d+(?:\\d{0})?/)[0];
  return parseFloat(value);
}

function Admin() {
  //Config Variables
  let xProvider = xConfigs['provider'];
  let xToken = xConfigs["token"];
  let xStakeAddress = xConfigs["stakeAddress"];
  let xApiLink = xConfigs["apiLink"];
  const { address, account } = useGetAccountInfo();
  let multiplier = 1000000000000000000;

  //Get the list with all the addresses participating in staking
  const [clientList, setClientList] = useState([]);
  const [clientListNumber, setClientListNumber] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const getClientList = async () => {
    try {
      let provider = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(provider);

      let stakeAddress = new Address(xStakeAddress);
      const abiLocation = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;
      let abiRegistry = await AbiRegistry.load({
        urls: [abiLocation],
      });
      let abi = new SmartContractAbi(abiRegistry, [`XLauncherStaking`]);

      let contract = new SmartContract({
        address: stakeAddress,
        abi: abi,
      });
      let interaction = contract.methods.getClientList();
      let queryResponse = await contract.runQuery(provider, interaction.buildQuery());

      let response = interaction.interpretQueryResponse(queryResponse);
      let myList = response.firstValue.valueOf();
      //console.log("myList " + JSON.stringify(myList, null, 2));
      setClientList(myList);
      setClientListNumber(myList.length);
      var timeLeftIterations = 1.5 * myList.length;
      if(timeLeftIterations >= 60){
        setTimeLeft(timeLeftIterations/60 + " min");
      }else{
        setTimeLeft(timeLeftIterations + " s");
      }

    } catch (error) {
      console.log(error);
    }
  };

  //iterate the addresses list and get info about the staked values for each address
  const [farm1StakedValues, setFarm1StakedValues] = useState([]);
  const [farm2StakedValues, setFarm2StakedValues] = useState([]);
  const [farm3StakedValues, setFarm3StakedValues] = useState([]);
  const getStakedValues = async (customAddress) => {
    try {
      let provider = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(provider);

      let stakeAddress = new Address(xStakeAddress);
      const abiLocation = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;
      let abiRegistry = await AbiRegistry.load({
        urls: [abiLocation],
      });
      let abi = new SmartContractAbi(abiRegistry, [`XLauncherStaking`]);

      let contract = new SmartContract({
        address: stakeAddress,
        abi: abi,
      });
      let interaction = contract.methods.getClientReport([
        new AddressValue(new Address(customAddress)),
      ]);
      let queryResponse = await contract.runQuery(provider, interaction.buildQuery());

      let response = interaction.interpretQueryResponse(queryResponse);
      let myList = response.firstValue.valueOf();
      //console.log("myList " + JSON.stringify(myList, null, 2));

      let farm1Amount = 0;
      let farm2Amount = 0;
      let farm3Amount = 0;

      if (myList["report_pull_items"]) {
        myList["report_pull_items"].map(item0 => {
          let switcher = parseInt(item0.pool_id);
          switch (switcher) {
            case 1:
              let farm1AmountAux = item0.pool_amount.toFixed() / multiplier;
              farm1Amount = parseInt(calc0(farm1AmountAux));
              break;
            case 2:
              let farm2AmountAux = item0.pool_amount.toFixed() / multiplier;
              farm2Amount = parseInt(calc0(farm2AmountAux));
              break;
            case 3:
              let farm3AmountAux = item0.pool_amount.toFixed() / multiplier;
              farm3Amount = parseInt(calc0(farm3AmountAux));
              break;
          }
        })
      }

      let farm1Object = {
        "address" : customAddress,
        "amount" : farm1Amount
      }
      let farm2Object = {
        "address" : customAddress,
        "amount" : farm2Amount
      }
      let farm3Object = {
        "address" : customAddress,
        "amount" : farm3Amount
      }

      if(farm1Object.amount){
        setFarm1StakedValues(farm1StakedValues => [...farm1StakedValues, farm1Object]);
      }
      if(farm2Object.amount){
        setFarm2StakedValues(farm2StakedValues => [...farm2StakedValues, farm2Object]);
      }
      if(farm3Object.amount){
        setFarm3StakedValues(farm3StakedValues => [...farm3StakedValues, farm3Object]);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const [iterations, setIterations] = useState(0);
  const [timePast, setTimePast] = useState(0);

  async function startProgram() {
    var i = 0;
    const interval = window.setInterval(() => {
      if(clientListNumber && i<= clientListNumber) {
        getStakedValues(clientList[i]);
        setIterations(i);

        var timeLeftIterations = 1.5 * (clientListNumber - i);
        if (timeLeftIterations >= 60) {
          setTimeLeft(timeLeftIterations / 60 + " min");
        } else {
          setTimeLeft(timeLeftIterations + " s");
        }

        var timePastIterations = 1.5 * i;
        if (timePastIterations >= 60) {
          setTimePast(timePastIterations / 60 + " min");
        } else {
          setTimePast(timePastIterations + " s");
        }
        i++;
      }
    }, 1500);
      return () => window.clearInterval(interval);

  }

  const result1 = farm1StakedValues.reduce((total, currentValue) => total = total + currentValue.amount,0);
  const result2 = farm2StakedValues.reduce((total, currentValue) => total = total + currentValue.amount,0);
  const result3 = farm3StakedValues.reduce((total, currentValue) => total = total + currentValue.amount,0);

  const admin = [
    "erd1vf74652wxr59vxhtp4wmlzyzwcd9f907nle9qg5el52y4re5yxnqwtltc9",
    "erd1pwpvplnj9l9f4ap56v9h92dtynqkwyrh3w80jfvz2f5q95av52qqdv9ydk",
    "erd1znusjpmfpukrtf0wscvf4su8yjqg393c092j8sxxvvrfk9m0rdss0646y0",
    "erd1fegge5067awlw94ksycw0gfk8z2zzz2l3rnesjuytz8ampucsnwq5ns2hn",
    "erd1xa39h8q20gy25449vw2qt4dm38pp3nnxp7kzga2pt54z4u2rgjlqadlgdl",
    "erd179xw6t04ug48m74jzyw9zq028hv66jhqayelzpzvgds0ptnzmckq2jf07f",
    "erd1pl8syl8y75tqakjftujaf432gc7z3rad94h5ejn0huv2dgf9qlnsyu6mqv"
  ];

  var adminLoggedIn = false;
  {
    admin.map(name => {
      if(name === address){
        adminLoggedIn = true;
        console.log('Yo have logged in with an admin address');
      }
    })
  }

  if(adminLoggedIn) {
    return (
        <Main name={false}>
          <Grid container spacing={2}>
            <Grid item xs={12} mt={-5} mb={4}>
              <VuiTypography
                  variant="h2"
                  textTransform="capitalize"
                  fontWeight="bold"
                  sx={{color: "#ffffff"}}
              >
                Stake Info
              </VuiTypography>
            </Grid>

            {/*Starting tools*/}
            <Grid item xs={6} lg={2} align="center">
              <Card sx={{minHeight: "235px"}}>
                <VuiTypography variant="h6" color="light">
                  Total Adrese
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {clientListNumber}
                </VuiTypography>
                <VuiButton
                    onClick={() => getClientList()}
                    color="info"
                    fullWidth
                    size="small"
                    sx={{marginTop: "20px"}}
                >
                  Calcul Adrese
                </VuiButton>
                <VuiButton
                    onClick={() => startProgram()}
                    color="info"
                    fullWidth
                    size="small"
                    sx={{marginTop: "20px"}}
                >
                  Start Program
                </VuiButton>
              </Card>
            </Grid>

            {/*Operation Details*/}
            <Grid item xs={6} lg={2} align="center">
              <Card sx={{minHeight: "235px"}}>
                <VuiTypography variant="h6" color="light">
                  Iteratii Ramase
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {clientListNumber - iterations}
                </VuiTypography>
                <VuiTypography variant="h6" color="light" mt={2}>
                  Timp Ramas
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {timeLeft}
                </VuiTypography>
                <VuiTypography variant="h6" color="light" mt={2}>
                  Timp Trecut
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {timePast}
                </VuiTypography>
              </Card>
            </Grid>

            {/*Farm1 tools*/}
            <Grid item xs={6} lg={2} align="center">
              <Card sx={{minHeight: "235px"}}>
                <VuiTypography variant="h6" color="light">
                  Ferma 1
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {farm1StakedValues.length}
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {new Intl.NumberFormat("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(result1)}
                </VuiTypography>
                <VuiButton
                    color="success"
                    fullWidth
                    size="small"
                    sx={{marginTop: "20px"}}
                >
                  <CSVLink
                      separator={";"}
                      data={farm1StakedValues}
                      filename="farm1StakedValues"
                      className={"white-text"}>
                    Export Excel
                  </CSVLink>
                </VuiButton>

                <VuiButton
                    color="success"
                    fullWidth
                    size="small"
                    sx={{marginTop: "20px"}}
                >
                  <CSVLink
                      separator={","}
                      data={farm1StakedValues}
                      filename="farm1StakedValues"
                      className={"white-text"}>
                    Export CSV
                  </CSVLink>
                </VuiButton>
              </Card>
            </Grid>

            {/*Farm2 tools*/}
            <Grid item xs={6} lg={2} align="center">
              <Card sx={{minHeight: "235px"}}>
                <VuiTypography variant="h6" color="light">
                  Ferma 2
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {farm2StakedValues.length}
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {new Intl.NumberFormat("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(result2)}
                </VuiTypography>
                <VuiButton
                    color="success"
                    fullWidth
                    size="small"
                    sx={{marginTop: "20px"}}
                >
                  <CSVLink
                      separator={";"}
                      data={farm2StakedValues}
                      filename="farm2StakedValues"
                      className={"white-text"}>
                    Export Excel
                  </CSVLink>
                </VuiButton>

                <VuiButton
                    color="success"
                    fullWidth
                    size="small"
                    sx={{marginTop: "20px"}}
                >
                  <CSVLink
                      separator={","}
                      data={farm2StakedValues}
                      filename="farm2StakedValues"
                      className={"white-text"}>
                    Export CSV
                  </CSVLink>
                </VuiButton>
              </Card>
            </Grid>

            {/*Farm3 tools*/}
            <Grid item xs={6} lg={2} align="center">
              <Card sx={{minHeight: "235px"}}>
                <VuiTypography variant="h6" color="light">
                  Ferma 3
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {farm1StakedValues.length}
                </VuiTypography>
                <VuiTypography color="light" variant={"subtitle2"} fontWeight={"light"}>
                  {new Intl.NumberFormat("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(result3)}
                </VuiTypography>
                <VuiButton
                    color="success"
                    fullWidth
                    size="small"
                    sx={{marginTop: "20px"}}
                >
                  <CSVLink
                      separator={";"}
                      data={farm3StakedValues}
                      filename="farm3StakedValues"
                      className={"white-text"}>
                    Export Excel
                  </CSVLink>
                </VuiButton>

                <VuiButton
                    color="success"
                    fullWidth
                    size="small"
                    sx={{marginTop: "20px"}}
                >
                  <CSVLink
                      separator={","}
                      data={farm3StakedValues}
                      filename="farm3StakedValues"
                      className={"white-text"}>
                    Export CSV
                  </CSVLink>
                </VuiButton>
              </Card>
            </Grid>
          </Grid>
        </Main>
    );
  }else{
    return (
        <Main name={"You are not logged in with an administrator account"}>

        </Main>
    );
  }
}

export default Admin;
