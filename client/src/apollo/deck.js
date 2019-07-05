import { gql } from "apollo-boost";
import client from "./client";

const decksQuery = gql`
  {
    decks {
      name
      description
    }
  }
`;

const deckIdsQuery = gql`
  {
    decks {
      name
      _id
    }
  }
`;

const addDeckMutation = gql`
  mutation CreateNewDeck($input: NewDeckInput!) {
    newDeck(input: $input) {
      name
      description
    }
  }
`;

const updateDeckMutation = gql`
  mutation UpdateDeck($id: ID!, $input: UpdateDeckInput!) {
    updateDeck(id: $id, input: $input) {
      name
      description
    }
  }
`;

const removeDeckMutation = gql`
  mutation RemoveDeck($id: ID!) {
    removeDeck(id: $id) {
      name
      description
    }
  }
`;

async function addDeck(variables) {
  return await client.mutate({ mutation: addDeckMutation, variables });
}

async function updateDeck(variables) {
  return await client.mutate({ mutation: updateDeckMutation, variables });
}

async function removeDeck(variables) {
  return await client.mutate({ mutation: removeDeckMutation, variables });
}

async function getDeckId(name) {
  var data = await client.query({
    query: deckIdsQuery,
    fetchPolicy: "no-cache"
  });
  var decks = data.data.decks;
  return decks.filter(deck => deck.name == name)[0]._id;
}

export { decksQuery, addDeck, updateDeck, removeDeck, getDeckId };
