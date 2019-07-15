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

const deleteAccountMutation = gql`
  mutation deleteAccount($input: DeleteAccountInput!) {
    deleteAccount(input: $input) {
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

async function deleteAccount(variables) {
  return await client.mutate({ mutation: deleteAccountMutation, variables });
}

export { updateUsername, updatePassword, deleteAccount };
