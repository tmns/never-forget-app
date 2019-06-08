import React, { Fragment } from "react";
import { connect } from "react-redux";
import ApolloClient, { gql } from "apollo-boost";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import CustomTheme from "../layout/CustomTheme";
import Navbar from "../layout/Navbar";
import Table from "./Table";
import Footer from "../layout/Footer";

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

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  credentials: "include"
});

const decksQuery = gql`
  {
    decks {
      name
      description
    }
  }
`;


const Dashboard = ({ session, size }) => {
  const classes = useStyles();
  
  var [deckData, setDeckData] = React.useState(
    {
      columns: [
        { title: "Name", field: "name" },
        { title: "Description", field: "description" }
      ],
      data: []
    }
  );

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
        setDeckData({...deckData, data: details});
        // to do: get number of cards in each deck + cards due for review
      } catch (err) {
        // handle error
      }
    }
    getDeckData();
  }, [])

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
        <Table title="Decks" data={deckData} />
      </Container>
      <Footer />
    </Fragment>
  );
};

const mapStateToProps = ({ session }) => ({
  session
});

export default connect(mapStateToProps)(Dashboard);
