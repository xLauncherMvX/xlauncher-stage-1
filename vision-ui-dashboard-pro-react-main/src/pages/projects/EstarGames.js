// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";
// Vision UI Dashboard PRO React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";

import Main from "layouts/main";
import profile1 from "assets/images/estarGames.jpeg";
import TimelineItem from "examples/Timeline/TimelineItem";

// ProductPage page components
import ProductImages from "components/estarGamesProductImages";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import IconButton from '@mui/material/IconButton';
import WebsiteIcon from '@mui/icons-material/Link';
import FileIcon from '@mui/icons-material/PictureAsPdf';
import TelegramIcon from '@mui/icons-material/Telegram';
import CollectionsIcon from '@mui/icons-material/Collections';

function List() {
  const { values } = breakpoints;

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  }

  const openInSameTab = (url) => {
    const newWindow = window.open(url, '_self', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null;
  }

  return (    
    <Main name="">
      <Grid container spacing={1}>  
        <Grid item xs={12} md={1} xl={2}>
        </Grid>      
        <Grid item xs={12} md={8} xl={8}>
          <Card>
            <VuiBox textAlign="center" mb={3}>
              <VuiTypography color="white" variant="h2">
                29.09.2022
              </VuiTypography>
            </VuiBox>
            <VuiBox
              component="img"
              src={profile1}
              mb="8px"
              borderRadius="15px"  
              width="100%"
              height="100%"            
            />
            <VuiBox display="flex" justifyContent="center" mt={1} mb={3}>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://equistar.estar.games/")}>          
                <WebsiteIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://www.linkedin.com/company/estar-games/")}>          
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://twitter.com/EstarToken")}>          
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://t.me/estartoken")}>          
                <TelegramIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://estar.games/whitepaper.pdf")}>          
                <FileIcon fontSize="small" />
              </IconButton>
              <IconButton className="float-right" color="white" onClick={()=> openInNewTab("https://www.frameit.gg/marketplace/EQUISTAR-3f393f/items")}>          
                <CollectionsIcon fontSize="small" />
              </IconButton>
            </VuiBox>
            
            <VuiBox mt={3} ml="-15px">
                <TimelineItem
                  title="GAMING COMPANY"             
                  description="ESTAR is a Gaming company dedicated to the development of games on the blockchain. We aim to create the best 
                  framework that is easy to understand and replicate. 
                  The project is aiming to create a vibrant ecosystem of games that shares between them the tokenomics with the central piece
                  being the $ESTAR Token."                   
                  lastItem               
                />
                <TimelineItem
                  title="INNOVATION"           
                  description="The first 2 games in the ecosystem, already in development, are EquiStar (horse racing) and EGoal(football manager).                   
                  To achieve the full maturity of the games and assure the ongoing development, we are creating individual teams for each of them and having regular meetings 
                  to share knowledge between the teams.  "
                  lastItem
                />
                <TimelineItem
                  title="TEAM"               
                  description="
                    EquiStar Team - Ichim Edi (back-end) / Butco Constantin (graphic) / Stefana Farcasu (front-end) / Damian;
                    EGoal Team - Damian ( blockchain dev) / Mateusz (front-end);
                    CEO - Sitaru Alexandru;
                    Advisor - Turea Andrei
                  "
                  lastItem
                />
                <TimelineItem
                  title="UNIQUE INVESTMENT OPPORTUNITY"               
                  description="A shared economy between games gives our investors a unique opportunity, if one of the games in the ecosystem is 
                  going to have a big impact creating hype around it, this is going to increase the overall value for everyone.
                  With a fair distribution and fixed total supply, $ESTAR is going to empower a true revolution in blockchain gaming."  
                  lastItem
                />                
            </VuiBox>      
            <VuiBox align="center" textAlign="center">
              <ProductImages />
            </VuiBox>
          </Card>
        </Grid>      
      </Grid>
    </Main>
  );
}

export default List;
