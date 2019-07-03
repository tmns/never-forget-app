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

export {
  cardsQuery
}