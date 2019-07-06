import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";

import CustomTheme from "../layout/CustomTheme";
import Navbar from "../layout/Navbar";
import StudyCard from "./StudyCard";
import Footer from "../layout/Footer";
import client from "../../apollo/client";
import { decksQuery } from "../../apollo/deck";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: CustomTheme.palette.primary.main,
      color: CustomTheme.palette.primary.contrastText
    }
  },
  paper: {
    marginTop: theme.spacing(10),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontWeight: 300    
  },
  header: {
    color: CustomTheme.palette.secondary.main,
    fontWeight: 300,
  },
  para: {
    fontWeight: 300,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

var exampleCards = [
  {
    id: 1,
    prompt: "το καλοκαίρι",
    promptExample: "Περάσαμε όλο το καλοκαίρι μας σε ένα νισάκι εδώ   κοντά.",
    target: "summer",
    targetExample: "We spent our entire summer on a nearby island."
  },
  {
    id: 2,
    prompt: "η εκπλήρωση",
    promptExample: "Το να πάω στο φεγγάρι θα ήταν η εκπλήρωση ενός ονείρου.",
    target: "fulfillment",
    targetExample: "Going to the moon would be the fulfillment of a dream."
  },
  {
    id: 3,
    prompt: "ο σκύλος",
    promptExample: "Ο σκύλος γαύγιζε τόσο πολύ που δεν μπορούσα να κοιμηθώ.",
    target: "dog",
    targetExample: "The dog was barking so much I couldn't sleep."
  }
];

const Study = ({ session, size }) => {
  const classes = useStyles();

  const [numCards, setNumCards] = useState(15);

  var NumCardsStyled = <span style={{color: CustomTheme.palette.secondary.main}}>{numCards}</span>

  return (
    <Fragment>
      <Navbar />
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
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
          <Typography
            component="h4"
            className={classes.para}
            align="center"
          >
            You have {NumCardsStyled} cards to study for this deck.
          </Typography>            
          <StudyCard cards={exampleCards} />
        </div>
      </Container>
      <Footer />
    </Fragment>
  );
};

const mapStateToProps = ({ session }) => ({
  session
});

export default connect(mapStateToProps)(Study);
