import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import { signOut } from "../../actions/session";

import CustomTheme from "./CustomTheme";

const useStyles = makeStyles(theme => ({
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: CustomTheme.palette.primary.main,
    color: CustomTheme.palette.secondary.main,
    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: "none"
    }
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1,
    fontWeight: 300
  },
  link: {
    textDecoration: "none !important",
    margin: theme.spacing(1, 1.5),
    color: CustomTheme.palette.secondary.main,
    borderColor: CustomTheme.palette.secondary.main
  }
}));

function Navbar({ signOut, loggedIn }) {
  const classes = useStyles();
  const guestLinks = (
    <nav>
      <Button
        component={Link}
        to="/signin"
        color="primary"
        variant="outlined"
        className={classes.link}
      >
        Sign In
      </Button>
      <Button
        component={Link}
        to="/signup"
        color="primary"
        variant="outlined"
        className={classes.link}
      >
        Sign Up
      </Button>
    </nav>
  );

  const authLinks = (
    <nav>
      <Button
        onClick={signOut}
        color="primary"
        variant="outlined"
        className={classes.link}
      >
        Logout
      </Button>
    </nav>
  );

  return (
    <Fragment>
      <ThemeProvider theme={CustomTheme}>
        <CssBaseline />
        <AppBar
          position="fixed"
          color="default"
          elevation={3}
          className={classes.appBar}
        >
          <Toolbar className={classes.toolbar}>
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              className={classes.toolbarTitle}
            >
              <Link className={classes.link} to={loggedIn ? "/dashboard" : "/"}>
              {loggedIn ? "Dashboard" : "Never Forget"}
              </Link>
            </Typography>
            {loggedIn ? authLinks : guestLinks}
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </Fragment>
  );
}

const mapStateToProps = ({ session }) => ({
  loggedIn: Boolean(session.userId)
});

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);
