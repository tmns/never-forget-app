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

// helper func to update card in database
async function updateCardInDB(oldData, newData, deckId) {
  var id = await getCardId(oldData.prompt, deckId);
  var variables = {
    input: {
      prompt: newData.prompt,
      target: newData.target,
      promptExample: newData.promptExample,
      targetExample: newData.targetExample
    },
    id,
  };
  try {
    return await updateCard(variables);
  } catch (e) {
    console.log(e);
  }
}

export {
  cardsQuery,
  getCardId,
  updateCard,
  updateCardInDB
}