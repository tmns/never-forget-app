import React, { Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Link from "@material-ui/core/Link";

import CustomTheme from "./CustomTheme";
import Navbar from "./Navbar";
import StudyCard from '../study/StudyCard'
import Footer from './Footer';

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: CustomTheme.palette.primary.main,
      color: CustomTheme.palette.primary.contrastText
    }
  },
  paper: {
    marginTop: theme.spacing(15),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontWeight: 300
  },
  header: {
    margin: theme.spacing(2)
  },
  link: {
    textDecoration: "none !important",
    color: CustomTheme.palette.secondary.main,
    "&:hover": {
      color: CustomTheme.palette.secondary.dark
    }
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

function Landing() {
  const classes = useStyles();

  var NeverForgetStyled = <span style={{color: CustomTheme.palette.secondary.main}}>Never Forget</span>;

  return (
    <Fragment>
      <ThemeProvider theme={CustomTheme}>
        <CssBaseline />
        <Navbar />
        <Container component="main" maxWidth="md">
          <div className={classes.paper}>
            <Typography className={classes.header} component="h1" variant="h3" align="center">
              Welcome to {NeverForgetStyled}
            </Typography>
            <Typography className={classes.header} component="h4" align="center">
              A <Link className={classes.link} href="https://www.youtube.com/watch?v=osK0Agqu7dc" target="_blank">Spaced Repetition Learning</Link> App<br/>
              Play around with the example cards below or sign up to create your own!
            </Typography>
            <StudyCard cards={exampleCards} demo={true}/>
          </div>
        </Container>
        <Footer />
      </ThemeProvider>
    </Fragment>
  );
}

export default Landing;
