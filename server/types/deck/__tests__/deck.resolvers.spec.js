import { AuthenticationError, UserInputError } from "apollo-server-core";

import mongoose from "mongoose";

import resolvers from "../deck.resolvers";
import { Deck } from "../deck.model";

describe("Deck Resolvers", () => {
  test("deck returns deck associated with given id when user object attached to session", async () => {
    expect.assertions(2);
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      id: deck._id
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var foundDeck = await resolvers.Query.deck(null, args, ctx);
    expect(`${foundDeck._id}`).toBe(`${deck._id}`);
    expect(`${foundDeck.createdBy}`).toBe(`${deck.createdBy}`);
  });

  test("deck throws AuthenticationError if user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      id: deck._id
    };
    var ctx = {
      session: {}
    };

    await expect(resolvers.Query.deck(null, args, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("deck throws UserInputError if the given deck id doesn't match a deck id associated with the user's id", async () => {
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });

    // we will create a deck by another user, which will be the id this user attempts to request - in this way, we also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    var otherUsersDeck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: otherUserId
    });

    var args = {
      id: otherUsersDeck._id
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Query.deck(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("decks returns all decks associated with user id if user object attached to session", async () => {
    expect.assertions(5);
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name1",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "name2",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "name3",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "name4",
      description: "description",
      createdBy: userId
    });

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var decks = await resolvers.Query.decks(null, null, ctx);
    expect(decks).toHaveLength(4);
    decks.forEach(deck => expect(`${deck.createdBy}`).toBe(`${userId}`));
  });

  test("decks throws AuthenticationError when user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name1",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "name2",
      description: "description",
      createdBy: userId
    });

    var ctx = {
      session: {}
    };

    await expect(resolvers.Query.decks(null, null, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("decks throw UserInputError when no decks associated with user id exists", async () => {
    var userId = mongoose.Types.ObjectId();

    // create other user and associate decks with their id to also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name1",
      description: "description",
      createdBy: otherUserId
    });
    await Deck.create({
      name: "name2",
      description: "description",
      createdBy: otherUserId
    });

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Query.decks(null, null, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("newDeck returns new deck object if user object attached to session and valid name and description given", async () => {
    expect.assertions(3);
    var args = {
      input: {
        name: "new-deck",
        description: "description"
      }
    };
    var ctx = {
      session: {
        user: {
          _id: mongoose.Types.ObjectId()
        }
      }
    };

    var newDeck = await resolvers.Mutation.newDeck(null, args, ctx);
    expect(newDeck.name).toBe(args.input.name);
    expect(newDeck.description).toBe(args.input.description);
    expect(newDeck.createdBy).toBe(ctx.session.user._id);
  });

  test("newDeck throws AuthenticationError if user object not attached to session", async () => {
    var args = {
      input: {
        name: "new-deck",
        description: "description"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(resolvers.Mutation.newDeck(null, args, ctx)).rejects.toThrow(
      AuthenticationError
    );
  });

  test("newDeck throws UserInputError if given deck name already exists and is associated with user's id", async () => {
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      input: {
        name: "name",
        description: "description"
      }
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(resolvers.Mutation.newDeck(null, args, ctx)).rejects.toThrow(
      UserInputError
    );
  });

  test("updateDeck updates the deck associated with the given id when session contains user object and inputs are valid", async () => {
    expect.assertions(3);
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      id: deck._id,
      input: {
        name: "new-name",
        description: "new-description"
      }
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var updatedDeck = await resolvers.Mutation.updateDeck(null, args, ctx);
    expect(`${updatedDeck._id}`).toBe(`${deck._id}`);
    expect(updatedDeck.name).toBe(args.input.name);
    expect(updatedDeck.description).toBe(args.input.description);
  });

  test("updateDeck throws AuthenticationError if user object not attached to session", async () => {
    var deck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: mongoose.Types.ObjectId()
    });
    var args = {
      id: deck._id,
      input: {
        name: "new-deck",
        description: "description"
      }
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.updateDeck(null, args, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  test("updateDeck throws UserInputError if the given deck id doesn't match a deck id associated with the user's id", async () => {
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });

    // we will create a deck by another user, which will be the id this user attempts to update in order to also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    var otherUsersDeck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: otherUserId
    });

    var args = {
      id: otherUsersDeck._id,
      input: {
        name: "new-name",
        description: "new-description"
      }
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(
      resolvers.Mutation.updateDeck(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("updateDeck throws UserInputError if given name already exists and is associated with userId", async () => {
    var userId = mongoose.Types.ObjectId();
    var existingDeck1 = await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    await Deck.create({
      name: "same-name",
      description: "",
      createdBy: userId
    });

    var args = {
      id: existingDeck1._id,
      input: {
        name: "same-name"
      }
    };

    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(
      resolvers.Mutation.updateDeck(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });

  test("removeDeck removes deck associated with given id and user id combo when user object attached to session", async () => {
    expect.assertions(3);
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      id: deck._id
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    var removedDeck = await resolvers.Mutation.removeDeck(null, args, ctx);
    expect(`${removedDeck._id}`).toBe(`${deck._id}`);
    expect(`${removedDeck.createdBy}`).toBe(`${deck.createdBy}`);
    expect(await Deck.findById(deck._id)).toBeFalsy();
  });

  test("removeDeck throws AuthenticationError if user object not attached to session", async () => {
    var userId = mongoose.Types.ObjectId();
    var deck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });
    var args = {
      id: deck._id
    };
    var ctx = {
      session: {}
    };

    await expect(
      resolvers.Mutation.removeDeck(null, args, ctx)
    ).rejects.toThrow(AuthenticationError);
  });

  test("removeDeck throws UserInputError if the given deck id doesn't match a deck id associated with the user's id", async () => {
    var userId = mongoose.Types.ObjectId();
    await Deck.create({
      name: "name",
      description: "description",
      createdBy: userId
    });

    // we will create a deck by another user, which will be the id this user attempts to remove - in this way, we also test authZ
    var otherUserId = mongoose.Types.ObjectId();
    var otherUsersDeck = await Deck.create({
      name: "name",
      description: "description",
      createdBy: otherUserId
    });

    var args = {
      id: otherUsersDeck._id
    };
    var ctx = {
      session: {
        user: {
          _id: userId
        }
      }
    };

    await expect(
      resolvers.Mutation.removeDeck(null, args, ctx)
    ).rejects.toThrow(UserInputError);
  });
});
