import { AuthenticationError, UserInputError } from "apollo-server-core";

import mongoose from "mongoose";

import resolvers from "../card.resolvers";
import { Deck } from "../../deck/deck.model";
import { Card } from "../card.model";

function createCardObject(prompt, deckId, userId) {
  return {
    prompt: prompt ? prompt : "prompt",
    target: "target",
    promptExample: "prompt-ex",
    targetExample: "target-ex",
    timeAdded: 1231,
    nextReview: 1234,
    intervalProgress: 3,
    deckId: deckId ? deckId : mongoose.Types.ObjectId(),
    createdBy: userId ? userId : mongoose.Types.ObjectId()
  };
}

describe("Card Resolvers", () => {
  test("card returns card associated with given id when user object attached to session", async () => {
    expect.assertions(2);
    var card = await Card.create(createCardObject());
    var args = {
      id: card._id
    };
    var ctx = {
      session: {
        user: {
          _id: card.createdBy
        }
      }
    };

    var foundCard = await resolvers.Query.card(null, args, ctx);
    expect(`${foundCard._id}`).toBe(`${card._id}`);
    expect(`${foundCard.createdBy}`).toBe(`${card.createdBy}`);
  });

  test("card throws AuthenticationError if user object not attached to session", async () => {
    var card = Card.create(createCardObject());
    var args = {
      id: card._id
    };
    var ctx = {
      session: {}
    };

    await expect(resolvers.Query.card(null, args, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("card throws UserInputError if the given card id doesn't match a card id associated with the user's id", async () => {
    var usersCard = await Card.create(createCardObject());

    // we will create a card by another user, which will be the id this user attempts to request - in this way, we also test authZ
    var otherUsersCard = await Card.create(createCardObject());

    var args = {
      id: otherUsersCard._id
    };
    var ctx = {
      session: {
        user: {
          _id: usersCard.createdBy
        }
      }
    };

    await expect(resolvers.Query.card(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("cards returns all cards associated with a given deck id and user id combo if user object attached to session", async () => {
    expect.assertions(9);
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    await Card.create(createCardObject("promp1", deck._id, userId));
    await Card.create(createCardObject("promp2", deck._id, userId));
    await Card.create(createCardObject("promp3", deck._id, userId));
    await Card.create(createCardObject("promp4", deck._id, userId));

    // create a few other cards with other deck._id
    await Card.create(createCardObject());
    await Card.create(createCardObject());

    var args = {
      deckId: deck._id
    };

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var cards = await resolvers.Query.cards(null, args, ctx);
    expect(cards).toHaveLength(4);
    cards.forEach(card => {
      expect(`${card.createdBy}`).toBe(`${userId}`);
      expect(`${card.deckId}`).toBe(`${deck._id}`);
    });
  });

  test("cards throws AuthenticationError when user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    await Card.create(createCardObject(null, deck._id, userId));

    var ctx = {
      session: {}
    };

    await expect(resolvers.Query.cards(null, null, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("cards throw UserInputError when no deck associated with given deckId and user id combo exists", async () => {
    var userId = mongoose.Types.ObjectId();

    // create other user and associate cards with their id to also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    var otherUserDeck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: otherUserId
    });
    await Card.create(createCardObject(null, otherUserDeck._id, otherUserId));
    await Card.create(createCardObject(null, otherUserDeck._id, otherUserId));

    var args = {
      deckId: otherUserDeck._id
    };

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Query.cards(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("newCard returns new card object if user object attached to session and valid inputs given", async () => {
    expect.assertions(9);
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var cardObject = createCardObject(null, deck._id);
    var args = {
      input: cardObject
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var newCard = await resolvers.Mutation.newCard(null, args, ctx);
    cardObject.createdBy = userId;
    for (let key of Object.keys(cardObject)) {
      expect(cardObject[key]).toBe(newCard[key]);
    }
  });

  test("newCard throws AuthenticationError if user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var cardObject = createCardObject(null, deck._id);
    var args = {
      input: cardObject
    };
    var ctx = {
      session: {}
    };

    await expect(resolvers.Mutation.newCard(null, args, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("newCard throws UserInputError if no deck associated with given deckId and userId combo exists.", async () => {
    var userId = mongoose.Types.ObjectId();

    // create other user and associate cards with their id to also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    var otherUserDeck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: otherUserId
    });
    await Card.create(createCardObject(null, otherUserDeck._id, otherUserId));
    await Card.create(createCardObject(null, otherUserDeck._id, otherUserId));

    var args = {
      input: createCardObject(null, otherUserDeck._id)
    };

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Mutation.newCard(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("newCard throws UserInputError if given prompt already exists and is associated with given deckId and userId", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var cardObject = createCardObject("same-prompt", deck._id, userId);
    await Card.create(cardObject);

    var args = {
      input: createCardObject("same-prompt", deck._Id)
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Mutation.newCard(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("newCard throws UserInputError if given prompt is invalid (ie has a length of less than 1 or greater than 300", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var args = {
      input: createCardObject("   ", deck._id)
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Mutation.newCard(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("updateCard updates the card associated with given deck id and user id combo when session contains user object and inputs are valid", async () => {
    expect.assertions(2);
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var existingCard = await Card.create(
      createCardObject(null, deck._id, userId)
    );
    var args = {
      id: existingCard._id,
      input: createCardObject("updated-prompt", deck._id)
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var updatedCard = await resolvers.Mutation.updateCard(null, args, ctx);
    expect(`${updatedCard._id}`).toBe(`${existingCard._id}`);
    expect(updatedCard.prompt).toBe(args.input.prompt);
  });

  test("updateCard throws AuthenticationError if user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var existingCard = await Card.create(
      createCardObject(null, deck._id, userId)
    );
    var args = {
      id: existingCard._id,
      input: createCardObject("new-prompt", deck._id)
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.updateCard(null, args, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  test("updateCard throws UserInputError if no deck associated with given deckId and userId combo exists.", async () => {
    var userId = mongoose.Types.ObjectId();

    // create other user and associate cards with their id to also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    var otherUserDeck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: otherUserId
    });
    var existingCard = Card.create(
      createCardObject(null, otherUserDeck._id, otherUserId)
    );

    var args = {
      id: existingCard._id,
      input: createCardObject("new-prompt", otherUserDeck._id)
    };

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(
      resolvers.Mutation.updateCard(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("updateCard throws UserInputError if given prompt already exists and is associated with given deckId and userId", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var cardObject1 = createCardObject("prompt", deck._id, userId);
    var existingCard1 = await Card.create(cardObject1);
    await Card.create(createCardObject("same-prompt", deck._id, userId));

    var args = {
      id: existingCard1._id,
      input: { prompt: "same-prompt" }
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(
      resolvers.Mutation.updateCard(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("updateCard throws UserInputError if given prompt is invalid (ie has a length of less than 1 or greater than 300", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var existingCard = Card.create(createCardObject(null, deck._id, userId));
    var args = {
      id: existingCard._id,
      input: createCardObject("   ", deck._id)
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(
      resolvers.Mutation.updateCard(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("removeCard removes card associated with given id and user id combo when user object attached to session", async () => {
    expect.assertions(3);
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var existingCard = await Card.create(createCardObject(null, deck._id, userId));
    var args = {
      id: existingCard._id
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var removedCard = await resolvers.Mutation.removeCard(null, args, ctx);
    expect(`${removedCard._id}`).toBe(`${existingCard._id}`);
    expect(`${removedCard.createdBy}`).toBe(`${existingCard.createdBy}`);
    expect(await Card.findById(existingCard._id)).toBeFalsy();
  })

  test("removeCard throws AuthenticationError when user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var existingCard = await Card.create(
      createCardObject(null, deck._id, userId)
    );
    var args = {
      id: existingCard._id
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.updateCard(null, args, ctx)
    ).rejects.toThrow(AuthenticationError);
  })

  test("removeCard throws UserInputError if given card id does not match a card id associated with the user's id", async () => {
    var userId = mongoose.Types.ObjectId();

    // we will create a card by another user, which will be the id this user attempts to remove - in this way, we also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "desc",
      createdBy: userId
    });
    var otherUserCard = await Card.create(createCardObject(null, deck._id, otherUserId));

    var args = {
      id: otherUserCard._id
    }
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    }

    await expect(resolvers.Mutation.removeCard(null, args, ctx)).rejects.toThrow(UserInputError);
  })
});
