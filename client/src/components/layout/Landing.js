import React, { Fragment } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Navbar from "./Navbar";
import CustomTheme from "./CustomTheme";

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
  }
}));

function Landing() {
  const classes = useStyles();

  return (
    <Fragment>
      <ThemeProvider theme={CustomTheme}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <Navbar />
          <div className={classes.paper}>
            <Typography className={classes.header} component="h1" variant="h3">
              Welcome to Never Forget
            </Typography>
            <Typography className={classes.header} component="h4">
              A Spaced Repetition Learning App
            </Typography>
          </div>
        </Container>
      </ThemeProvider>
    </Fragment>
  );
}

export default Landing;
