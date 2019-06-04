import React from "react";
import { Route, Redirect } from "react-router-dom";
import { gql } from "apollo-boost";
import { Query } from "react-apollo";

const IS_LOGIN = gql`
  {
    isLogin
  }
`;

const RequiresAuth = ({ component: Component, ...rest }) => {
  return (
    <Query query={IS_LOGIN}>
      { ({ data, error }) => {
        if (error) console.log(error);
        console.log(data);
        // return (
        //   <Route
        //     {...rest}
        //     render = {props =>
        //       data.isLogin ? <Component {...props} /> : <Redirect to="/signin" />
        //     }
        //   />
        // )
        return (
          <h1>test</h1>
        )
      }}
    </Query> 
  );
}


export default RequiresAuth;