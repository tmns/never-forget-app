import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import IconButton from "@material-ui/core/IconButton";

import CustomTheme from "../layout/CustomTheme";
import Navbar from "../layout/Navbar";
import StudyCard from "./StudyCard";
import Footer from "../layout/Footer";

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
    fontWeight: 300
  },
  para: {
    fontWeight: 300,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  button: {
    color: CustomTheme.palette.secondary.main,
    fontSize: "17px",
    "&:hover": {
      color: CustomTheme.palette.secondary.dark,
      backgroundColor: CustomTheme.palette.primary.main
    }
  },
  input: {
    display: "none"
  }
}));

const Study = ({ session, cards, deckId, setStudyState }) => {
  const classes = useStyles();

  const [numCards, setNumCards] = useState(cards.length);

  var NumCardsStyled = (
    <span style={{ color: CustomTheme.palette.secondary.main }}>
      {numCards}
    </span>
  );

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
          <Typography component="h4" className={classes.para} align="center">
            You have {NumCardsStyled} cards to study for this deck.
          </Typography>
          <StudyCard
            deckId={deckId}
            cards={cards}
            numCards={numCards}
            setNumCards={setNumCards}
          />
          <div
            onClick={() => {
              setStudyState({ isStudying: false });
            }}
          >
            <IconButton className={classes.button}>
              <ArrowBackOutlinedIcon /> Return to decks
            </IconButton>
          </div>
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
