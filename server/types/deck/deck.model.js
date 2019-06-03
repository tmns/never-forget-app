import mongoose from "mongoose";
import { UserInputError } from "apollo-server-core";

const deckSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 24
    },
    description: {
      type: String,
      trim: true,
      maxlength: 100
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "user"
    }
  },
  { timestamps: true }
);

// static functions

deckSchema.statics.findDeck = async function(_id, createdBy) {
  var deck = await this.findOne({ _id, createdBy }).lean();
  if (!deck) {
    throw new UserInputError(`No deck with id ${_id} found`);
  }
  return deck;
};

deckSchema.statics.findDecks = async function(createdBy) {
  var decks = await this.find({ createdBy }).lean();
  if (decks.length == 0) {
    throw new UserInputError("No decks found");
  }
  return decks;
};

deckSchema.statics.createDeck = async function(name, description, createdBy) {
  var foundDeck = await this.findOne({ name, createdBy }).lean();
  if (foundDeck) {
    throw new UserInputError(`A deck with name '${name}' already exists`);
  }

  return await this.create({ name, description, createdBy });
};

deckSchema.statics.findAndUpdateDeck = async function(_id, props, createdBy) {
  var foundDeck = await this.findOne({ _id, createdBy });
  if (!foundDeck) {
    throw new UserInputError(`No deck with id ${_id} found`);
  }

  var tProps = trimProps(props);

  // if user updating name, check if another deck already exists with same name
  if (tProps.hasOwnProperty("name")) {
    var foundDeckWithSameName = await this.findOne({
      name: tProps.name,
      createdBy
    }).lean();

    if (foundDeckWithSameName) {
      throw new UserInputError(
        `A deck with name '${tProps.name}' already exists`
      );
    }
  }

  return await this.findByIdAndUpdate(
    _id,
    { ...tProps, createdBy },
    { new: true }
  ).lean();
};

deckSchema.statics.findAndDeleteDeck = async function(_id, createdBy) {
  var foundDeck = await this.findOne({ _id, createdBy });
  if (!foundDeck) {
    throw new UserInputError(`No deck with id ${_id} found`);
  }
  return await this.findByIdAndDelete(_id).lean();
};

// ********** helper funcs
function trimProps(props) {
  var tProps = {};
  for (let key of Object.keys(props)) {
    tProps[key] = props[key].trim();
  }
  return tProps;
}

export const Deck = mongoose.model("deck", deckSchema);
