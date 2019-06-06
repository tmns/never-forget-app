import React, { Fragment } from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import { signOut } from "../../actions/session";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    },
    ul: {
      margin: 0,
      padding: 0
    },
    li: {
      listStyle: "none"
    }
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  }
}));

function Navbar({ signOut, loggedIn }) {
  const classes = useStyles();

  const guestLinks = (
    <nav>
      <Button
        href="/signin"
        color="primary"
        variant="outlined"
        className={classes.link}
      >
        Sign In
      </Button>
      <Button
        href="/signup"
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
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            {loggedIn ? 'Dashboard' : 'Never Forget'}
          </Typography>
          {loggedIn ? authLinks : guestLinks}
        </Toolbar>
      </AppBar>
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
