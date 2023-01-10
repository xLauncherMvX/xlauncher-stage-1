// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import breakpoints from "assets/theme/base/breakpoints";
import Main from "layouts/main";
import DefaultProjectCard from "cards/DefaultProjectCard";
import profile1 from "assets/images/zero2InfinityMini.jpeg";
import profile2 from "assets/images/estarGamesMini.png";
import profile3 from "assets/images/vestaXFinancesMini2.png";
import profile3b from "assets/images/vestaXFinancesMini.png";
function List() {
    const { values } = breakpoints;
    
    var imgSrc = profile3b;
    if (window.innerWidth < breakpoints.values.xxl) {
        imgSrc = profile3b;
    } else {
        imgSrc = profile3;
    }

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
              <Grid item xs={12} md={4} xl={4}>
                  <Card>
                      <DefaultProjectCard
                          image={imgSrc}
                          label="project #3"
                          title="VestaX.Finances"
                          description=
                          "
                              VestaX.Finance is a community-driven liquid staking DEFI service provider for MultiverseX.
                              VestaX.Finance allows users to stake the native EGLD token and earn staking rewards without locking assets.
                          "
                          action={{
                              type: "internal",
                              route: "/projects/VestaXFinance",
                              color: "white",
                              label: "view",
                          }}
                          action2={{
                              route: "https://demiourgos.synaps.me/signup",
                              color: "white",
                              label: "KYC"
                          }}
                      />
                  </Card>
              </Grid>
          </Grid>
        </Main>
    );
}

export default List;
