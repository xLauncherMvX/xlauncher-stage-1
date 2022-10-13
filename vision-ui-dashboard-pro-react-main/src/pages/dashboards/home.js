import React, { useState, useEffect, useLayoutEffect } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
// Vision UI Dashboard PRO React components
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";

//Elrond
import {
  useGetAccountInfo
} from "@elrondnetwork/dapp-core";
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

function calc3(theform) {
  var with3Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,3})?/)[0];
  return parseFloat(with3Decimals);
}

function Home() {
  //Config Variables
  let xProvider = xConfigs['provider'];
  let xStakeAddress = xConfigs["stakeAddress"];

  const { address, account } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);
  let multiplier = 1000000000000000000;

  //Get the list of the clients that have staked xlh
  const [clientsNumberData, setClientsNumberData] = useState(0);
  const [clientsListData, setClientListData] = useState([]);
  const getClientsListData = async () => {
    try {
      let providerCSD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCSD);

      let addressCSD = new Address(xStakeAddress);
      const abiLocationCSD = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;

      let abiRegistryCSD = await AbiRegistry.load({
        urls: [abiLocationCSD],
      });
      let abiCSD = new SmartContractAbi(abiRegistryCSD, [`XLauncherStaking`]);

      let contractCSD = new SmartContract({
        address: addressCSD,
        abi: abiCSD,
      });

      let interactionCSD = contractCSD.methods.getClientList();

      let queryResponseCSD = await contractCSD.runQuery(providerCSD, interactionCSD.buildQuery());

      let responseCSD = interactionCSD.interpretQueryResponse(queryResponseCSD);
      let myListCSD = responseCSD.firstValue.valueOf();
      //console.log("myListCSD " + JSON.stringify(myListCSD, null, 2));

      setClientListData(myListCSD);
      setClientsNumberData(myListCSD.length);
      return myListCSD;

    } catch (error) {
      console.log(error);
    }
  };

  //Get the required data for each wallet
  const [farm1Amount, setFarm1Amount] = useState(0);
  const [farm2Amount, setFarm2Amount] = useState(0);
  const [farm3Amount, setFarm3Amount] = useState(0);
  const [farm1List, setFarm1List] = useState([]);
  const [farm2List, setFarm2List] = useState([]);
  const [farm3List, setFarm3List] = useState([]);
  const auxList1 = [];
  const auxList2 = [];
  const auxList3 = [];
  var nr1 = 0;
  var nr2 = 0;
  var nr3 = 0;
  async function getClientReportData(customAddress) {
    try {
      let providerCRD = new ProxyProvider(xProvider);
      await NetworkConfig.getDefault().sync(providerCRD);

      let addressCRD = new Address(xStakeAddress);
      const abiLocationCRD = `${process.env.PUBLIC_URL}/xlauncher-staking.abi.json`;

      let abiRegistryCRD = await AbiRegistry.load({
        urls: [abiLocationCRD],
      });
      let abiCRD = new SmartContractAbi(abiRegistryCRD, [`XLauncherStaking`]);

      let contractCRD = new SmartContract({
        address: addressCRD,
        abi: abiCRD,
      });

      let interactionCRD = contractCRD.methods.getClientReport([
        new AddressValue(new Address(customAddress)),
      ]);

      let queryResponseCRD = await contractCRD.runQuery(providerCRD, interactionCRD.buildQuery());

      let responseCRD = interactionCRD.interpretQueryResponse(queryResponseCRD);
      let myList = responseCRD.firstValue.valueOf();
      //console.log("myList " + JSON.stringify(myList, null, 2));
      myList["report_pull_items"].map((client1) => {
        if (client1.pool_id == 1) {
          auxList1.push(customAddress);
          nr1 += (parseFloat(client1.pool_amount)/multiplier);
        }
        if (client1.pool_id == 2) {
          auxList2.push(customAddress);
          nr2 += (parseFloat(client1.pool_amount)/multiplier);
        }
        if (client1.pool_id == 3) {
          auxList3.push(customAddress);
          nr3 += (parseFloat(client1.pool_amount)/multiplier);
        }
      });
    } catch (error) {
      console.log(error);
    }
    setFarm1Amount(nr1);
    setFarm2Amount(nr2);
    setFarm3Amount(nr3);
    setFarm1List(auxList1);
    setFarm2List(auxList2);
    setFarm3List(auxList3);
  }

  function getAllData() {
    getClientsListData();
    clientsListData.map((customAddress) => {
      getClientReportData(customAddress);
    });
  }

  useEffect(() => {
    getAllData();
  },[]);

  return (
      <Main name="">
        <Grid container mt={2} align={"center"}>
          <Grid item xs={12}>
            <VuiButton onClick={()=>getAllData()}>
              Click me
            </VuiButton>
          </Grid>
          <Grid item xs={3}>
            <Grid container>
              <Grid item xs={12}>
                <VuiTypography variant="md" fontWeight="bold" color="white">
                  Total Staked Farm 1:
                </VuiTypography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <VuiTypography variant="md" color="success">
                  {calc3(farm1Amount)}
                </VuiTypography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container>
              <Grid item xs={12}>
                <VuiTypography variant="md" fontWeight="bold" color="white">
                  Total Staked Farm 2:
                </VuiTypography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <VuiTypography variant="md" color="success">
                  {calc3(farm2Amount)}
                </VuiTypography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <Grid container>
              <Grid item xs={12}>
                <VuiTypography variant="md" fontWeight="bold" color="white">
                  Total Staked Farm 3:
                </VuiTypography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <VuiTypography variant="md" color="success">
                  {calc3(farm3Amount)}
                </VuiTypography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

      </Main>
  );
}

export default Home;