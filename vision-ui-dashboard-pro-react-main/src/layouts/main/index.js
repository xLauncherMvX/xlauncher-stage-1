import React, { useState } from "react";

// react-router components
import { Route, useLocation } from "react-router-dom";

// @mui material components
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Globe from "examples/Globe";

// Vision UI Dashboard PRO React example components
import DashboardLayout from "layoutContainers/DashboardLayout";
import DashboardNavbar from "Navbars/DashboardNavbar";
import Sidenav from "examples/Sidenav";

// Vision UI Dashboard PRO React routes
import routes from "routes";

// Vision UI Dashboard PRO React contexts
import { useVisionUIController, setMiniSidenav } from "context";

// Plugins custom css
import "assets/theme/base/plugins.css";

import typography from "assets/theme/base/typography";

const style = {
  textAlign: "center",
  padding: "20px",
  position: "relative",
  left: "0",
  bottom: "0",
  height: "60px",
  width: "100%",
  marginTop: "60px"
};

function Main(props) {
  const { values } = breakpoints;
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();
  const { size } = typography;

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
              <Grid item lg={12} mt={5}>
                  {props.name? (
                      <VuiBox mb={4} p={1}>
                          <VuiTypography
                              variant={window.innerWidth < values.sm ? "h3" : "h2"}
                              textTransform="capitalize"
                              fontWeight="bold"
                              color="white"
                          >
                              {props.name}
                          </VuiTypography>
                      </VuiBox>
                  ) : ('')}
              </Grid>
              <Grid item lg={12}>
                  {props.children}
              </Grid>
          </Grid>
          <div>
            <div style={style}>
              <iframe src='https://egld.community/api/products/fdc676ce-0ec1-4460-b59f-c74d4ec2eef9/upvotes/embed' width='290' height='70' className="custom-footer"/>
            <VuiBox
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              align="center"
              color="white"
              fontSize={size.sm}
              px={1.5}
            >
              &copy; 2022, made with
              <VuiBox fontSize={size.md} color="text" mb={-0.5} mx={0.25} align="center">
                <Icon color="error" fontSize="inherit">
                  favorite
                </Icon>
              </VuiBox>
              by the
              <VuiTypography variant="h6" fontWeight="medium" color="white">
                &nbsp;XLauncher Team&nbsp;
              </VuiTypography>
            </VuiBox>
            </div>
          </div>
      </DashboardLayout>
    );
}

export default Main;