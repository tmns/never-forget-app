import React, { Fragment } from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import { MuiThemeProvider } from "@material-ui/core/styles";
import CustomTheme from "../layout/CustomTheme";
import Navbar from "../layout/Navbar";
import Table from "./Table";
import Footer from "../layout/Footer";
import client from "../../apollo/client";
import { decksQuery } from "../../apollo/deck";
import Study from "../study/Study";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: CustomTheme.palette.primary.main,
      color: CustomTheme.palette.primary.contrastText
    }
  },
  header: {
    color: CustomTheme.palette.secondary.main,
    fontWeight: 300,
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(5)
  }
}));

const Dashboard = ({ session, size }) => {
  const classes = useStyles();

  var [deckData, setDeckData] = React.useState({
    title: "Decks",
    columns: [
      { title: "Name", field: "name" },
      { title: "Description", field: "description" }
    ],
    data: []
  });

  var [studyState, setStudyState] = React.useState({
    isStudying: false,
    deckId: null,
    cards: null
  });

  React.useEffect(() => {
    async function getDeckData() {
      // fetch decks
      try {
        var data = await client.query({
          query: decksQuery,
          fetchPolicy: "no-cache"
        });
        var details = data.data.decks.map(deckObject => ({
          name: deckObject.name,
          description: deckObject.description
        }));
        setDeckData({ ...deckData, data: details });
      } catch (err) {
        // handle error
      }
    }
    getDeckData();
  }, []);

  if (studyState.isStudying == false) {
    return (
      <Fragment>
        <Navbar />
        <CssBaseline />
        <Container component="main" maxWidth="sm">
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            noWrap
            className={classes.header}
            align="center"
          >
            Welcome back, {session.username}!
          </Typography>
          <MuiThemeProvider theme={CustomTheme}>
            <Table
              data={deckData}
              setDeckData={setDeckData}
              setStudyState={setStudyState}
            />
          </MuiThemeProvider>
        </Container>
        <Footer />
      </Fragment>
    );
  } else {
    return (
      <Study
        cards={studyState.cards}
        deckId={studyState.deckId}
        setStudyState={setStudyState}
      />
    );
  }
};

const mapStateToProps = ({ session }) => ({
  session
});

export default connect(mapStateToProps)(Dashboard);
