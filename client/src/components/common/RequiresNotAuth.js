import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

const mapStateToProps = ({ session }) => ({
  loggedIn: Boolean(session.userId)
})

const RequiresNotAuth = ({ loggedIn, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !loggedIn ? <Component {...props} /> : <Redirect to="/dashboard" />
    }
  />
);

export default connect(mapStateToProps)(RequiresNotAuth);
