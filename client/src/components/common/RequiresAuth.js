import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const mapStateToProps = ({ session }) => ({
  loggedIn: Boolean(session.userId)
});

const RequiresAuth = ({ loggedIn, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      loggedIn ? <Component {...props} /> : <Redirect to="/signin" />
    }
  />
);

export default connect(mapStateToProps)(RequiresAuth);
