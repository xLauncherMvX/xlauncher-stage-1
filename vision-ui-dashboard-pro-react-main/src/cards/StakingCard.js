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

import * as React from 'react';

// react-router components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Icon from '@mui/material/Icon';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import VuiInput from "components/VuiInput";

import { ReactComponent as XLauncherLogo } from "assets/images/logo.svg";
import "assets/custom.css";
import { IoHome } from "react-icons/io5";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 5,
  bgcolor: '#060b28f0',
  borderRadius: "25px",
  p: 4
};

function StakingCard({
  methodS, maxMethodS, onChangeMethodS, xlhAmountValueS, 
  methodU, maxMethodU, onChangeMethodU, xlhAmountValueU, 
  methodC,
  title, lockedTime, myXLH, apr, myRewards, stake, claim, reinvest, unstake, modalFarmName, xlhBalance
}) 
{
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [openU, setOpenU] = React.useState(false);
  const handleOpenU = () => setOpenU(true);
  const handleCloseU = () => setOpenU(false);
  const [visible, setVisible] = React.useState(false);  

  return (
    <Card sx={{ minHeight: "250px" }}>
      <VuiBox>
        <VuiButton
          variant="text"
          size="small"
          color="light"
          onClick={() => setVisible(!visible)}
          className="float-right"
        >
          {visible ? 
          (
            <Tooltip key="visible" title="Hide extra" placement="bottom">
              <Typography sx={{fontSize: 25, marginTop: -1, marginRight: -5, color: 'white'}}>&#9651;</Typography>
            </Tooltip>
          ) : 
          (
            <Tooltip key="invisible" title="Show extra" placement="bottom">
              <Typography sx={{fontSize: 25, marginTop: -1, marginRight: -5}}>&#9661;</Typography>
            </Tooltip>
          )}          
        </VuiButton>
        <VuiBox display="flex" mb="12px" alignItems="center">
          <Tooltip key="logo" title="XLH" placement="bottom">
            <XLauncherLogo className='xlh-logo-stake'/>
          </Tooltip>
          <VuiBox ml="16px" display="flex" flexDirection="column" lineHeight={0}>
            <VuiTypography
              fontSize={16}
              fontWeight="medium"
              color="white"
              textTransform="capitalize"
            >
              {title}
            </VuiTypography>
            <VuiTypography
                variant="caption"
                fontWeight="regular"
                color="text"
                textTransform="capitalize"
              >
                {lockedTime}
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          <VuiTypography component="span" fontSize={14} fontWeight="regular" color="text">
            APR:
          </VuiTypography>
          <VuiTypography fontSize={14} fontWeight="regular" color="white">
            {apr}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          <VuiTypography component="span" fontSize={14} fontWeight="regular" color="text">
            My Staked XLH:
          </VuiTypography>
          <VuiTypography fontSize={14} fontWeight="regular" color="white">
            {myXLH}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center">
          <VuiTypography component="span" fontSize={14} fontWeight="regular" color="text">
            My Earned XLH:
          </VuiTypography>
          <VuiTypography fontSize={14} fontWeight="regular" color="white">
            {myRewards}
          </VuiTypography>
        </VuiBox>
        <Divider light />
        <Grid container spacing={1}>
          <Grid item xs={12} md={6} lg={6}>
            <VuiButton
              color={stake.color}
              size={stake.size}
              sx={{ minWidth: "90px" }}
              onClick={handleOpen}
              fullWidth
            >
              {stake.label}
            </VuiButton>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Tooltip key="claim" title={claim.hint} placement="bottom">
              <VuiButton
                color={claim.color}
                size={claim.size}
                sx={{ minWidth: "90px" }}
                onClick={methodC}
                fullWidth
              >
                {claim.label}
              </VuiButton>
            </Tooltip>
          </Grid>     
        </Grid>
        {visible && 
          <Grid container spacing={1} mt={0}>
            <Grid item xs={12} md={6} lg={6}>
              <Tooltip key="reinvest" title={reinvest.hint} placement="bottom">
                <VuiButton
                  color={reinvest.color}
                  size={reinvest.size}
                  sx={{ minWidth: "90px" }}
                  onClick={() => reinvest.action}
                  fullWidth
                >
                  {reinvest.label}
                </VuiButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Tooltip key="unstake" title={unstake.hint} placement="bottom">
                <VuiButton
                  color={unstake.color}
                  size={unstake.size}
                  sx={{ minWidth: "90px" }}
                  onClick={handleOpenU}
                  fullWidth
                >
                  {unstake.label}
                </VuiButton>
              </Tooltip>
            </Grid>
          </Grid>
        }
        {/* Modal Stake */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <VuiBox sx={{ minHeight: "250px" }} className="farm-card">
                <VuiBox display="flex" mb="12px" alignItems="center">
                  <Tooltip key="logo" title="XLH" placement="bottom">
                    <XLauncherLogo className='xlh-logo-stake'/>
                  </Tooltip>
                  <VuiBox ml="16px" display="flex" flexDirection="column" lineHeight={0}>
                    <VuiTypography
                      fontSize={16}
                      fontWeight="medium"
                      color="white"
                      textTransform="capitalize"
                      id="transition-modal-title"
                    >
                      Stake in XLH {modalFarmName}
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
                <VuiBox id="transition-modal-description" sx={{ mt: 5 }}>    
                  <Grid container spacing={2}>
                    <Grid item xs={9}>
                      <VuiInput 
                        value={xlhAmountValueS}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChange={onChangeMethodS}                        
                        placeholder="Amount" 
                        size="medium"
                        
                      >                    
                      </VuiInput>
                    </Grid>
                    <Grid item xs={2}>
                      <VuiButton
                          variant="outlined"
                          color="light"
                          size="medium"
                          onClick={maxMethodS}
                          fullWidth
                        >
                          Max
                      </VuiButton> 
                    </Grid>
                  </Grid>
                  <VuiTypography
                      fontSize={12}
                      color="white"
                      textTransform="capitalize"
                      marginBottom="5px"
                      marginLeft="13px"
                      marginTop="2px"
                    >
                      Balance: 
                      {new Intl.NumberFormat("ro-Ro", {
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2,
                      }).format(xlhBalance)} 
                      XLH
                  </VuiTypography>   
                  <Grid container spacing={1} mt={5}>
                    <Grid item xs={12} md={6} lg={6}>
                      <VuiButton
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{ minWidth: "90px" }}
                        onClick={methodS}
                        fullWidth
                      >
                        Stake
                      </VuiButton>     
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <VuiButton
                        variant="outlined"
                        color="light"
                        size="small"
                        sx={{ minWidth: "90px" }}
                        onClick={handleClose}
                        fullWidth
                      >
                        Cancel
                      </VuiButton>     
                    </Grid>
                  </Grid>
                </VuiBox>
              </VuiBox>              
            </Box>
          </Fade>
        </Modal>
        {/* Modal Unstake */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openU}
          onClose={handleCloseU}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openU}>
            <Box sx={style}>
              <VuiBox sx={{ minHeight: "250px" }} className="farm-card">
                <VuiBox display="flex" mb="12px" alignItems="center">
                  <Tooltip key="logo" title="XLH" placement="bottom">
                    <XLauncherLogo className='xlh-logo-stake'/>
                  </Tooltip>
                  <VuiBox ml="16px" display="flex" flexDirection="column" lineHeight={0}>
                    <VuiTypography
                      fontSize={16}
                      fontWeight="medium"
                      color="white"
                      textTransform="capitalize"
                      id="transition-modal-title"
                    >
                     Unstake XLH from {modalFarmName}
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
                <VuiBox id="transition-modal-description" sx={{ mt: 5 }}>    
                  <Grid container spacing={2}>
                    <Grid item xs={9}>
                      <VuiInput 
                        value={xlhAmountValueU}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onChange={onChangeMethodU}                        
                        placeholder="Amount" 
                        size="medium"
                        
                      >                    
                      </VuiInput>
                    </Grid>
                    {/* <Grid item xs={2}>
                      <VuiButton
                          variant="outlined"
                          color="light"
                          size="medium"
                          onClick={maxMethodU}
                          fullWidth
                        >
                          Max
                      </VuiButton> 
                    </Grid> */}
                  </Grid>
                  <Grid container spacing={1} mt={5}>
                    <Grid item xs={12} md={6} lg={6}>
                      <VuiButton
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{ minWidth: "90px" }}
                        onClick={methodU}
                        fullWidth
                      >
                        Unstake
                      </VuiButton>     
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <VuiButton
                        variant="outlined"
                        color="light"
                        size="small"
                        sx={{ minWidth: "90px" }}
                        onClick={handleCloseU}
                        fullWidth
                      >
                        Cancel
                      </VuiButton>     
                    </Grid>
                  </Grid>
                </VuiBox>
              </VuiBox>
              
            </Box>
          </Fade>
        </Modal>
      </VuiBox>
    </Card>
  );
}

export default StakingCard;
