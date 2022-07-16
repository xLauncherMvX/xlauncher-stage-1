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

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";
// Vision UI Dashboard PRO React base styles
import typography from "assets/theme/base/typography";
// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import Footer from "examples/FooterXLH";
import Globe from "examples/Globe";
// Vision UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


// icons
import { FaShoppingCart } from "react-icons/fa";
import { BsGlobe } from "react-icons/bs";
import { IoWallet, IoDocumentText } from "react-icons/io5";

import Main from "layouts/main";
import DefaultProjectCard from "cards/DefaultProjectCard";
import profile1 from "assets/images/zero2InfinityMini.jpeg";
function List() {
  const { values } = breakpoints;

  return (    
    <Main name="Projects">      
      <Grid container spacing={3}>               
        <Grid item xs={12} md={4} xl={4}>
          <Card>
            <DefaultProjectCard
              image={profile1}
              label="project #1"
              title="Zero 2 Infinity"
              description="
              Zero 2 Infinity mission: enable people with a project and a passion to place themselves above the Earth 
              in order to collect rich data, take high definition images, manage communications and more, much more."
              action={{
                type: "internal",
                route: "/projects/Zero2Infinity",
                color: "white",
                label: "view",
              }}
            />
          </Card>
        </Grid>        
      </Grid>
    </Main>
  );
}

export default List;
