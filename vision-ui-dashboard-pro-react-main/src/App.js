/** 

=========================================================
* Vision UI PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-dashboard-pro-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Visionware.

*/

import { useState, useEffect } from "react";

// react-router components
import { Route, Switch, Redirect, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";

// Vision UI Dashboard PRO React themes
import theme from "assets/theme";

// Vision UI Dashboard PRO React routes
import routes from "routes";

// Vision UI Dashboard PRO React contexts
import { useVisionUIController } from "context";

// Plugins custom css
import "assets/theme/base/plugins.css";

//Elrond core
import { DappProvider} from '@elrondnetwork/dapp-core';

//Env config
import xConfigs from 'configs/envConfig.json';
const environment = xConfigs["environment"];

export default function App() {
  const [controller] = useVisionUIController();
  const { direction } = controller;
  const { pathname } = useLocation();

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} component={route.component} key={route.key} />;
      }

      return null;
    });

    return (
      <ThemeProvider theme={theme}> 
        <DappProvider
            environment={environment}
            customNetworkConfig={{ name: 'customConfig', apiTimeout: 6000 }}
            completedTransactionsDelay={200}
          >
            <Switch>
              {getRoutes(routes)}
               <Redirect from="*" to="/dashboard" />
              {/*<Redirect from="*" to="/staking/farms" />*/}
            </Switch>
          </DappProvider>
      </ThemeProvider>
    );
}
