import ApolloClient, { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  credentials: "include"
});

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

async function signUp(variables) {
  return await client.mutate({ mutation: signUpMutation, variables });
}

async function signIn(variables) {
  return await client.mutate({ mutation: signInMutation, variables });
}

async function signOut() {
  return await client.mutate({ mutation: signOutMutation })
}

export {
  signUp,
  signIn,
  signOut
}
