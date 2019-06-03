import { Deck } from "../deck.model";
import mongoose from "mongoose";

describe("Deck model", () => {
  describe("schema", () => {
    test("name", () => {
      var name = Deck.schema.obj.name;
      expect(name).toEqual({
        type: String,
        required: true,
        trim: true,
        maxlength: 24
      });
    });

    test("description", () => {
      var description = Deck.schema.obj.description;
      expect(description).toEqual({
        type: String,
        trim: true,
        maxlength: 100
      });
    });

    test("createdBy", () => {
      var createdBy = Deck.schema.obj.createdBy;
      expect(createdBy).toEqual({
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "user"
      });
    });
  });
});
