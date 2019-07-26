import { gql } from "apollo-boost";
import client from "../apollo/client";

const isLoginQuery = gql`
  {
    isLogin
  }
`;

const whoamiQuery = gql`
  {
    whoami {
      username
      _id
    }
  }
`;

const signUpMutation = gql`
  mutation signup($input: NewUserInput!) {
    signup(input: $input) {
      username
      _id
    }
  }
`;

const signInMutation = gql`
  mutation signin($input: LoginUserInput!) {
    login(input: $input) {
      username
      _id
    }
  }
`;

const signOutMutation = gql`
  mutation logout {
    logout {
      username
      _id
    }
  }
`;

async function checkLoggedIn(preloadedState) {
  var data = await client.query({ query: isLoginQuery });
  if (data.data.isLogin) {
    data = await client.query({ query: whoamiQuery });
    preloadedState = {
      session: {
        username: data.data.whoami.username,
        userId: data.data.whoami._id
      }
    }
  } else {
    preloadedState = {};
  }
  return preloadedState;
}

async function signUp(variables) {
  return await client.mutate({ mutation: signUpMutation, variables });
}

async function signIn(variables) {
  var data = await client.mutate({ mutation: signInMutation, variables });
  return {
    username: data.data.login.username,
    userId: data.data.login._id
  }
}

async function signOut() {
  return await client.mutate({ mutation: signOutMutation })
}

export {
  checkLoggedIn,
  signUp,
  signIn,
  signOut
}
