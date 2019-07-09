import { gql } from "apollo-boost";
import client from "./client";

const updateUsernameMutation = gql`
  mutation updateUsername($input: UpdateUsernameInput!) {
    updateUsername(input: $input) {
      username
      _id
    }
  }
`;

const updatePasswordMutation = gql`
  mutation updatePassword($input: UpdatePasswordInput!) {
    updatePassword(input: $input) {
      username
      _id
    }
  }
`;

async function updateUsername(variables) {
  return await client.mutate({ mutation: updateUsernameMutation, variables });
}

async function updatePassword(variables) {
  return await client.mutate({ mutation: updatePasswordMutation, variables });
}

export {
  updateUsername,
  updatePassword
}