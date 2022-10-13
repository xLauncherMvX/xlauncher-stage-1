import React, { useState, useEffect } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Slider from '@mui/material/Slider';

// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import VuiButton from "components/VuiButton";
import VuiInput from "components/VuiInput";

import { ReactComponent as XLauncherLogo } from "assets/images/logo.svg";
import "assets/custom.css";

import { faAnglesDown } from '@fortawesome/free-solid-svg-icons/faAnglesDown';
import { faAnglesUp } from '@fortawesome/free-solid-svg-icons/faAnglesUp';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';

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

function calc0(theform) {
  var with1Decimal = theform.toString().match(/^-?\d+(?:\\d{0})?/)[0];
  var value = with1Decimal;
  return value;
}

function calc1(theform) {
  var with1Decimal = theform.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
  var value = with1Decimal;
  return value;
}

function calc2(theform) {
  var with2Decimals = theform.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  var value = with2Decimals;
  return parseFloat(value);
}

function StakingCard({
  stake, methodS, maxMethodS, handleSliderChangeS, handleInputChangeS, xlhAmountValueS, openS, handleOpenS, handleCloseS, 
  unstake, methodU, maxMethodU, handleSliderChangeU, handleInputChangeU, xlhAmountValueU, openU, handleOpenU, handleCloseU, unstakedAmount,
  claim, methodC,
  reinvest, methodR,
  lockedRewards, openL, handleOpenL, handleCloseL, 
  title, lockedTime, myXLH, apr, myRewards, modalFarmName, xlhBalance, isLoggedIn, showInfo, lockedRewardsLabel, mbv, myRewardsColor  
}) 
{  
  const [visible, setVisible] = React.useState(false);  
  
  if(!openS){
    openS = false;
  }
  if(!openU){
    openU = false;
  }
  if(!openL){
    openL = false;
  }

  let visibleSection;
  if(visible){
    visibleSection = 
      <Tooltip key="invisible" title="Hide extra" placement="bottom">
        <IconButton className="float-right" onClick={() => setVisible(!visible)}>          
          <FontAwesomeIcon fontSize={"medium"} icon={faAnglesUp} color="white" />
        </IconButton>
      </Tooltip>
    ;
  }else{
    visibleSection = 
      <Tooltip key="invisible2" title="Show extra" placement="bottom">
        <IconButton className="float-right" onClick={() => setVisible(!visible)}>          
          <FontAwesomeIcon fontSize={"medium"} icon={faAnglesDown} color="white"  />
        </IconButton>
      </Tooltip>
    ;
  }

  let visibleLoggedInSection;
  if(isLoggedIn){
    visibleLoggedInSection = visibleSection;
  }else{
    visibleLoggedInSection = " ";
  }

  let buttonsLoggedInSection;
  if(isLoggedIn){
    buttonsLoggedInSection = 
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} lg={6}>
          <VuiButton
            color={stake.color}
            size={stake.size}
            sx={{ minWidth: "90px" }}
            onClick={handleOpenS}
            fullWidth
            disabled={stake.disabled}
          >
            {stake.label}
          </VuiButton>
        </Grid>
        <Grid item xs={12} md={6} lg={6}> 
          <Tooltip key="claim" title={claim.hint} placement="bottom">
              <VuiBox>
                <VuiButton
                  color={claim.color}
                  size={claim.size}
                  sx={{ minWidth: "90px" }}
                  onClick={methodC}
                  fullWidth
                  disabled={claim.disabled}
                >
                  {claim.label}
                </VuiButton> 
              </VuiBox>   
          </Tooltip>                   
        </Grid>     
      </Grid>
    ;
  }else{
    buttonsLoggedInSection = 
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} lg={6}>
          <VuiButton
            color={stake.color}
            size={stake.size}
            sx={{ minWidth: "90px" }}            
            fullWidth
            disabled
          >
            {stake.label}
          </VuiButton>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>          
          <VuiButton
            color={claim.color}
            size={claim.size}
            sx={{ minWidth: "90px" }}
            fullWidth
            disabled
          >
            {claim.label}
          </VuiButton>          
        </Grid>     
      </Grid>
    ;
  }

  let infoModalSection = "";
  if(showInfo){
    infoModalSection = 
    <Tooltip key="modale" title="Open" placement="bottom">
      <IconButton onClick={handleOpenL}>          
        <FontAwesomeIcon fontSize={"medium"} icon={faCircleInfo} color="white"/>
      </IconButton>
    </Tooltip>
    ;
  }

  if(!unstakedAmount){
    unstakedAmount = 0;
  }

  return (
    <Card sx={{ minHeight: "250px" }}>
      <VuiBox>        
        {visibleLoggedInSection}
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
        <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb="-5px">
          <VuiTypography component="span" fontSize={14} fontWeight="regular" color="text">
            My Earned XLH:
          </VuiTypography>
          <VuiTypography fontSize={14} fontWeight="regular" color={myRewardsColor}>
            {myRewards}
          </VuiTypography>
        </VuiBox>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={mbv}>
          <VuiTypography component="span" fontSize={14} fontWeight="regular" color="text">
            {lockedRewardsLabel}
          </VuiTypography>
          {infoModalSection}
        </VuiBox>
        <Divider light />
        {buttonsLoggedInSection}
        {visible && 
          <Grid container spacing={1} mt={0}>   
            <Grid item xs={12} md={6} lg={6}>
              <Tooltip key="reinvest" title={reinvest.hint} placement="bottom">
                <VuiBox>
                  <VuiButton
                    color={reinvest.color}
                    size={reinvest.size}
                    sx={{ minWidth: "90px" }}
                    onClick={methodR}
                    fullWidth
                    disabled={reinvest.disabled}
                  >
                    {reinvest.label}
                  </VuiButton>  
                </VuiBox>
              </Tooltip>                          
            </Grid>         
            <Grid item xs={12} md={6} lg={6}>      
              <Tooltip key="claim" title={unstake.hint} placement="bottom">
                <VuiBox>        
                  <VuiButton
                    color={unstake.color}
                    size={unstake.size}
                    sx={{ minWidth: "90px" }}
                    onClick={handleOpenU}
                    fullWidth
                    disabled={unstake.disabled}
                  >
                    {unstake.label}
                  </VuiButton>    
                </VuiBox>
              </Tooltip>          
            </Grid>            
          </Grid>
        }
        {/* Modal Stake */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openS}
          onClose={handleCloseS}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openS}>
            <Box sx={style}>
              <VuiBox sx={{ minHeight: "250px" }} className="farm-card">
                <VuiBox display="flex" mb="12px" alignItems="center">
                  <Tooltip key="logox" title="XLH" placement="bottom">
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
                        size="small"
                        placeholder="XLH Amount" 
                        onChange={handleInputChangeS}
                        onKeyPress={(event) => {
                          if (!/[0-9.]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        disabled={false}
                      />
                      <Slider
                        value={xlhAmountValueS}
                        onChange={handleSliderChangeS}
                        step={100}
                        min={0}        
                        max={calc2(xlhBalance)}   
                      />
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
                      marginTop="2px"
                    >
                      Balance: 
                      {new Intl.NumberFormat("en-GB", {
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
                        disabled={stake.disabledAction}
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
                        onClick={handleCloseS}
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
          aria-labelledby="transition-modal-title2"
          aria-describedby="transition-modal-description2"
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
                  <Tooltip key="logo2" title="XLH" placement="bottom">
                    <XLauncherLogo className='xlh-logo-stake'/>
                  </Tooltip>
                  <VuiBox ml="16px" display="flex" flexDirection="column" lineHeight={0}>
                    <VuiTypography
                      fontSize={16}
                      fontWeight="medium"
                      color="white"
                      textTransform="capitalize"
                      id="transition-modal-title2"
                    >
                     Unstake XLH from {modalFarmName}
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>
                <VuiBox id="transition-modal-description2" sx={{ mt: 5 }}>    
                  <Grid container spacing={2}>
                    <Grid item xs={9}>                      
                      <VuiInput
                        value={xlhAmountValueU}
                        size="small"
                        placeholder="XLH Amount" 
                        onChange={handleInputChangeU}
                        onKeyPress={(event) => {
                          if (!/[0-9.]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        disabled={false}
                      />
                      <Slider
                        value={xlhAmountValueU}
                        onChange={handleSliderChangeU}
                        step={100}
                        min={0}        
                        max={calc2(unstakedAmount)}   
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <VuiButton
                          variant="outlined"
                          color="light"
                          size="medium"
                          onClick={maxMethodU}
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
                      Total: {myXLH} XLH
                  </VuiTypography> 
                  <VuiTypography
                      fontSize={12}
                      color="white"
                      textTransform="capitalize"
                      marginBottom="5px"
                      marginLeft="13px"
                      marginTop="2px"
                    >
                      Available: {calc2(unstakedAmount)} XLH
                  </VuiTypography> 
                  <Grid container spacing={1} mt={5}>
                    <Grid item xs={12} md={6} lg={6}>
                      <VuiButton
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{ minWidth: "90px" }}
                        onClick={methodU}
                        fullWidth
                        disabled={unstake.disabledAction}
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
        {/* Modal Locked Rewards */}
        <Modal
          aria-labelledby="transition-modal-title3"
          aria-describedby="transition-modal-description3"
          open={openL}
          onClose={handleCloseL}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={openL}>
            <Box sx={style}>
              <VuiBox sx={{ minHeight: "250px" }} className="farm-card">
                <VuiBox display="flex" mb="12px" alignItems="center">
                  <Tooltip key="logo3" title="XLH" placement="bottom">
                    <XLauncherLogo className='xlh-logo-stake'/>
                  </Tooltip>
                  <VuiBox ml="16px" display="flex" flexDirection="column" lineHeight={0}>
                    <VuiTypography
                      fontSize={16}
                      fontWeight="medium"
                      color="white"
                      textTransform="capitalize"
                      id="transition-modal-title3"
                    >
                      {modalFarmName} Unlock Schedule 
                    </VuiTypography>
                  </VuiBox>
                </VuiBox>                
                <VuiBox id="transition-modal-description3" sx={{ mt: 5 }}>  
                  <Grid container height={"100%"}>
                    <Grid item xs={12}  className="overflow-item">                    
                      {lockedRewards}                    
                    </Grid>
                  </Grid>
                  <Grid container spacing={1} mt={5}>   
                                  
                    <Grid item xs={12} md={12} lg={12}>
                      <VuiButton
                        variant="outlined"
                        color="light"
                        size="small"
                        sx={{ minWidth: "90px" }}
                        onClick={handleCloseL}
                        fullWidth
                      >
                        Close
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
