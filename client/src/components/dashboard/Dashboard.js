import React, { Fragment } from "react";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../layout/Navbar";
import CustomTheme from '../layout/CustomTheme';

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: CustomTheme.palette.primary.main,
      color: CustomTheme.palette.primary.contrastText
    },
  },
  header: {
    color: CustomTheme.palette.secondary.main,
    fontWeight: 300,
    marginTop: theme.spacing(10)
  }
}));

const Dashboard = ({ session }) => {
  const classes = useStyles();

  return (
    <Fragment>
      <Navbar />
      <CssBaseline />
      <Typography
        variant="h3"
        color="inherit"
        noWrap
        className={classes.header}
      >
        Welcome back, {session.username}!
      </Typography>
  </Fragment>
  )
}

const mapStateToProps = ({ session }) => ({
  session
});

export default connect(mapStateToProps)(Dashboard);
