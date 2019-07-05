import { gql } from "apollo-boost";
import client from "./client";

const cardsQuery = gql`
    query getCards($deckId: ID!) {
      cards(deckId: $deckId) {
        prompt
        target
        promptExample
        targetExample
    }
  }
`;

const cardIdsQuery = gql`
    query getCards($deckId: ID!) {
      cards(deckId: $deckId) {
        prompt
        _id
    }
  }
`;

const updateCardMutation = gql`
  mutation UpdateCard($id: ID!, $input: UpdateCardInput!) {
    updateCard(id: $id, input: $input) {
      prompt
      target
      promptExample
      targetExample
    }
  }
`;

async function updateCard(variables) {
  return await client.mutate({ mutation: updateCardMutation, variables });
}

async function getCardId(prompt, deckId) {
  var data = await client.query({
    query: cardIdsQuery,
    variables: { deckId },
    fetchPolicy: "no-cache"
  });
  var cards = data.data.cards;
  return cards.filter(card => card.prompt == prompt)[0]._id;
}

export {
  cardsQuery,
  getCardId,
  updateCard
}