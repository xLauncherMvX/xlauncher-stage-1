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

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import Grid from "@mui/material/Grid";

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiInput from "components/VuiInput";
import VuiButton from "components/VuiButton";
import VuiBadge from "components/VuiBadge";
import VuiAvatar from "components/VuiAvatar";

function TeamProfileCard({ color, title, description, total, apy, holders, amount, rating}) {
  const ratings = {
    0.5: [
      <Icon key={1}>star_outline</Icon>,
      <Icon key={2}>star_outline</Icon>,
      <Icon key={3}>star_outline</Icon>,
      <Icon key={4}>star_outline</Icon>,
      <Icon key={5}>star_outline</Icon>,
    ],
    1: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star_outline</Icon>,
      <Icon key={3}>star_outline</Icon>,
      <Icon key={4}>star_outline</Icon>,
      <Icon key={5}>star_outline</Icon>,
    ],
    1.5: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star_half</Icon>,
      <Icon key={3}>star_outline</Icon>,
      <Icon key={4}>star_outline</Icon>,
      <Icon key={5}>star_outline</Icon>,
    ],
    2: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star</Icon>,
      <Icon key={3}>star_outline</Icon>,
      <Icon key={4}>star_outline</Icon>,
      <Icon key={5}>star_outline</Icon>,
    ],
    2.5: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star</Icon>,
      <Icon key={3}>star_half</Icon>,
      <Icon key={4}>star_outline</Icon>,
      <Icon key={5}>star_outline</Icon>,
    ],
    3: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star</Icon>,
      <Icon key={3}>star</Icon>,
      <Icon key={4}>star_outline</Icon>,
      <Icon key={5}>star_outline</Icon>,
    ],
    3.5: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star</Icon>,
      <Icon key={3}>star</Icon>,
      <Icon key={4}>star_half</Icon>,
      <Icon key={5}>star_outline</Icon>,
    ],
    4: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star</Icon>,
      <Icon key={3}>star</Icon>,
      <Icon key={4}>star</Icon>,
      <Icon key={5}>star_outline</Icon>,
    ],
    4.5: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star</Icon>,
      <Icon key={3}>star</Icon>,
      <Icon key={4}>star</Icon>,
      <Icon key={5}>star_half</Icon>,
    ],
    5: [
      <Icon key={1}>star</Icon>,
      <Icon key={2}>star</Icon>,
      <Icon key={3}>star</Icon>,
      <Icon key={4}>star</Icon>,
      <Icon key={5}>star</Icon>,
    ],
  };

  return (
    <Card>
      <VuiBox>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <VuiTypography variant="lg" fontWeight="bold" color="white" textTransform="capitalize">
            {title}
          </VuiTypography>
        </VuiBox>
        <VuiBox mb={2}>
          <VuiTypography fontSize={14} fontWeight="regular" color="white">
            {description}
          </VuiTypography>
        </VuiBox>
        <VuiBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
          {total ? (
            <VuiBox component="li" display="flex" flexDirection="column">
              <VuiBox display="flex" justifyContent="space-between" alignItems="center">
                <VuiTypography fontSize={14} fontWeight="regular" color="white">
                  Total Staked:
                </VuiTypography>
                <VuiTypography fontSize={14} fontWeight="regular" color="white">
                  {total}
                </VuiTypography>
              </VuiBox>
              <Divider light />
            </VuiBox>
          ) : null}
          {apy ? (
            <VuiBox component="li" display="flex" flexDirection="column">
              <VuiBox display="flex" justifyContent="space-between" alignItems="center">
                <VuiTypography fontSize={14} fontWeight="regular" color="white">
                  APR:
                </VuiTypography>
                <VuiTypography fontSize={14} fontWeight="regular" color="white">
                  {apy}
                </VuiTypography>
              </VuiBox>
              <Divider light />
            </VuiBox>
          ) : null}
          {holders ? (
            <VuiBox component="li" display="flex" flexDirection="column">
              <VuiBox display="flex" justifyContent="space-between" alignItems="center">
                <VuiTypography fontSize={14} fontWeight="regular" color="white">
                Holders:
                </VuiTypography>
                <VuiTypography fontSize={14} fontWeight="regular" color="white">
                  {holders}
                </VuiTypography>
              </VuiBox>
              <Divider light />
            </VuiBox>
          ) : null}
          {amount ? (
            <VuiBox component="li" display="flex" flexDirection="column">
              <VuiBox display="flex" justifyContent="space-between" alignItems="center">
                <VuiTypography fontSize={14} fontWeight="regular" color="white" mr={5}>
                 Amount:
                </VuiTypography>
                <VuiInput type="number" placeholder="Set the amount of XLH" size="small" />
              </VuiBox>
              <Divider light />
            </VuiBox>
          ) : null}
          {rating ? (
            <VuiBox component="li" display="flex" flexDirection="column">
              <VuiBox display="flex" justifyContent="space-between" alignItems="center">
                <VuiTypography fontSize={14} fontWeight="regular" color="text">
                  Rating:
                </VuiTypography>
                <VuiBox
                  sx={({ functions: { pxToRem }, palette: { warning } }) => ({
                    fontSize: pxToRem(18),
                    fontWeight: "regular",
                    lineHeight: 0,
                    color: warning.main,
                  })}
                >
                  {ratings[rating]}
                </VuiBox>
              </VuiBox>
              <Divider light />
            </VuiBox>
          ) : null}
          <Grid container spacing={5} justifyContent="center" alignItems="center">
            <Grid item xs mt={1}>
              <VuiButton color="primary" sx={{ minWidth: "200px" }}>
                  Stake
              </VuiButton>
            </Grid>
            <Grid item xs mt={1}>
              <VuiButton color="primary" sx={{ minWidth: "200px" }}>
                  Claim
              </VuiButton>
            </Grid>
            <Grid item xs mt={1}>
              <VuiButton color="primary" sx={{ minWidth: "200px" }}>
                  Reinvest
              </VuiButton>
            </Grid>
            <Grid item xs mt={1}>
              <VuiButton color="primary" sx={{ minWidth: "200px" }}>
                  UnStake
              </VuiButton>
            </Grid>
          </Grid>
        </VuiBox>
      </VuiBox>
    </Card>
  );
}

// Setting default values for the props of TeamProfileCard
TeamProfileCard.defaultProps = {
  color: "info",
  total: "",
  apy: "0%",
  holders: 0,
  amount: true,
  rating: 0
};

// Typechecking props for the TeamProfileCard
TeamProfileCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  total: PropTypes.string,
  apy: PropTypes.string,
  holders: PropTypes.number,
  amount: PropTypes.bool,
  rating: PropTypes.number
};

export default TeamProfileCard;
