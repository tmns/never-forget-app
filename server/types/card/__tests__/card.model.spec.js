import { Card } from "../card.model";
import mongoose from "mongoose";

describe("Card model", () => {
  describe("schema", () => {
    test("prompt", () => {
      var prompt = Card.schema.obj.prompt;
      expect(prompt).toEqual({
        type: String,
        required: true,
        trim: true,
        maxlength: 300
      });
    });

    test("target", () => {
      var target = Card.schema.obj.target;
      expect(target).toEqual({
        type: String,
        required: true,
        trim: true,
        maxlength: 300
      });
    });

    test("promptExample", () => {
      var promptExample = Card.schema.obj.promptExample;
      expect(promptExample).toEqual({
        type: String,
        trim: true,
        maxlength: 300
      });
    });

    test("targetExample", () => {
      var targetExample = Card.schema.obj.targetExample;
      expect(targetExample).toEqual({
        type: String,
        trim: true,
        maxlength: 300
      });
    });

    test("timeAdded", () => {
      var timeAdded = Card.schema.obj.timeAdded;
      expect(timeAdded).toEqual({
        type: Number,
        required: true
      });
    });

    test("nextReview", () => {
      var nextReview = Card.schema.obj.nextReview;
      expect(nextReview).toEqual({
        type: Number,
        required: true
      });
    });

    test("intervalProgress", () => {
      var intervalProgress = Card.schema.obj.intervalProgress;
      expect(intervalProgress).toEqual({
        type: Number,
        required: true
      });
    });

    test("deckId", () => {
      var deckId = Card.schema.obj.deckId;
      expect(deckId).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: "deck",
        required: true
      });
    });

    test("createdBy", () => {
      var createdBy = Card.schema.obj.createdBy;
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: true
      });
    });
  });
});
