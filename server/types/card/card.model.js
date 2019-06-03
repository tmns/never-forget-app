import mongoose from "mongoose";
import { UserInputError } from "apollo-server-core";

import { hasValidInputs } from "../../utils/validation";

import { Deck } from "../deck/deck.model";

const cardSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  target: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  promptExample: {
    type: String,
    trim: true,
    maxlength: 300
  },
  targetExample: {
    type: String,
    trim: true,
    maxlength: 300
  },
  timeAdded: {
    type: Number,
    required: true
  },
  nextReview: {
    type: Number,
    required: true
  },
  intervalProgress: {
    type: Number,
    required: true
  },
  deckId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "deck",
    required: true
  },
  createdBy: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true
  }
});

// static functions

cardSchema.statics.findCard = async function(_id, createdBy) {
  var foundCard = await this.findOne({ _id, createdBy }).lean();
  if (!foundCard) {
    throw new UserInputError(`No card with id ${_id} found`);
  }

  return foundCard;
};

cardSchema.statics.findCards = async function(deckId, createdBy) {
  // make sure user has access to given deck
  var foundDeck = await Deck.findOne({ _id: deckId, createdBy });
  if (!foundDeck) {
    throw new UserInputError(`No deck with id ${deckId} found`);
  }

  return await this.find({ deckId, createdBy }).lean();
};

cardSchema.statics.createCard = async function(props, createdBy) {
  var foundDeck = await Deck.findOne({ _id: props.deckId, createdBy });
  if (!foundDeck) {
    throw new UserInputError(`No deck with id ${props.deckId} found`);
  }

  // trim white space from prompt, target, and their examples
  var tProps = trimProps(props);

  // validate prompt, target, and their examples
  if (!hasValidInputs(tProps)) {
    throw new UserInputError("Invalid inputs.");
  }

  // check if card already exists
  var foundCard = await this.findOne({
    prompt: tProps.prompt,
    deckId: tProps.deckId,
    createdBy
  }).lean();
  if (foundCard) {
    throw new UserInputError(
      `A card with prompt '${tProps.prompt}' already exists`
    );
  }

  return await this.create({ ...tProps, createdBy });
};

cardSchema.statics.findAndUpdateCard = async function(_id, props, createdBy) {
  var foundDeck = await Deck.findOne({ _id: props.deckId, createdBy });
  if (!foundDeck) {
    throw new UserInputError(`No deck with id ${props.deckId} found`);
  }

  var tProps = trimProps(props);

  if (!hasValidInputs(tProps)) {
    throw new UserInputError("Invalid inputs.");
  }

  if (tProps.hasOwnProperty("prompt")) {
    var foundCardWithSamePrompt = await this.findOne({
      prompt: tProps.prompt,
      deckId: props.deckId,
      createdBy
    }).lean();
    
    if (foundCardWithSamePrompt) {
      throw new UserInputError(
        `A card with prompt '${tProps.prompt}' already exists`
      );
    }
  }

  var foundCard = await this.findOne({ _id, createdBy });
  if (!foundCard) {
    throw new UserInputError(`No card with id ${_id} found`);
  }

  return await this.findByIdAndUpdate(
    _id,
    { ...tProps, createdBy },
    { new: true }
  ).lean();
};

cardSchema.statics.findAndDeleteCard = async function(_id, createdBy) {
  var foundCard = await this.findOne({ _id, createdBy });
  if (!foundCard) {
    throw new UserInputError(`No card with id ${_id} found`);
  }
  return await this.findByIdAndDelete(_id).lean();
};

// ********** helper funcs

function trimProps(props) {
  var trimmableProps = ["prompt", "target", "promptExample", "targetExample"];

  var trimmedProps = {};
  for (let key of Object.keys(props)) {
    if (trimmableProps.includes(key)) {
      trimmedProps[key] = props[key].trim();
    } else {
      trimmedProps[key] = props[key];
    }
  }

  return trimmedProps;
}

export const Card = mongoose.model("card", cardSchema);
