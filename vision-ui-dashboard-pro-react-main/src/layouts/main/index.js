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

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Route, Switch, Redirect, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import Footer from "examples/FooterXLH";
import Globe from "examples/Globe";

// Vision UI Dashboard PRO React example components
import DashboardLayout from "layoutContainers/DashboardLayout";
import DashboardNavbar from "Navbars/DashboardNavbar";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Vision UI Dashboard PRO React themes
import theme from "assets/theme";

// Vision UI Dashboard PRO React routes
import routes from "routes";

// Vision UI Dashboard PRO React contexts
import { useVisionUIController, setMiniSidenav } from "context";

// Plugins custom css
import "assets/theme/base/plugins.css";

// icons
import { FaShoppingCart } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";
import { IoWallet, IoDocumentText } from "react-icons/io5";

function Main(props) {
  const { values } = breakpoints;
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

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
      <DashboardLayout>
          <CssBaseline />  
          {/* <Globe
              display={{ xs: "none", md: "block" }}
              position="absolute"
              top="10%"
              left="30%"
              mt={{ xs: -12, lg: 1 }}
              mr={{ xs: 0, md: -10, lg: 10 }}
              canvasStyle={{ marginTop: "3rem"}}
          /> */}
          <DashboardNavbar/> 
          <Sidenav
              color="info"
              brandName="XLauncher"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
          />    
          <Grid container>
              <Grid item lg={12}>
                  <VuiBox mb={7} p={1} mt={5}>
                      <VuiTypography
                          variant={window.innerWidth < values.sm ? "h3" : "h2"}
                          textTransform="capitalize"
                          fontWeight="bold"
                          color="white"
                      >
                          {props.name}
                      </VuiTypography>
                  </VuiBox>                    
              </Grid>
              <Grid item lg={12}>
                  {props.children}
              </Grid>                
          </Grid>          
      </DashboardLayout>
    );
}

export default Main;