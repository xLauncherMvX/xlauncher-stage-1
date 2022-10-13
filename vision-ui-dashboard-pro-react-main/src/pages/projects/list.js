// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";
import Main from "layouts/main";
import DefaultProjectCard from "cards/DefaultProjectCard";
import profile1 from "assets/images/zero2InfinityMini.jpeg";
import profile2 from "assets/images/estarGamesMini.png";
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
        <Grid item xs={12} md={4} xl={4}>
          <Card>
            <DefaultProjectCard
              image={profile2}
              label="project #2"
              title="Estar.Games"
              description="
              ESTAR.GAMES project is aiming to create a vibrant ecosystem of games that shares between
              them the tokenomics with the central piece being the $ESTAR Token."
              action={{
                type: "internal",
                route: "/projects/EstarGames",
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
