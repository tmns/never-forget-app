import React from "react";
import { Route, Redirect } from "react-router-dom";

// import AuthContext from '../../context/auth';

const RequiresAuth = ({ component: Component, ...rest }) => (
  // <AuthContext.Consumer>
  //   {(isLoggedIn, _) => (
      <Route
        {...rest}
        render = {props =>
          true ? <Component {...props} /> : <Redirect to="/signin" />
        }
      />
      // )}
  // </AuthContext.Consumer>
);


export default RequiresAuth;