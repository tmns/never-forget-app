import React from "react";
import { Route, Redirect } from "react-router-dom";

// import AuthContext from "../../context/auth";

const RequiresNotAuth = ({ component: Component, ...rest }) => (
  // <AuthContext.Consumer>
  //   {(isLoggedIn, _) => (
      <Route
        {...rest}
        render={props =>
          true ? (
            <Component {...props} />
          ) : (
            <Redirect to="/dashboard" />
          )
        }
      />
  //   )}
  // </AuthContext.Consumer>
);

export default RequiresNotAuth;
