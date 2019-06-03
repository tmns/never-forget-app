import { buildSchema } from "graphql";
import { schemaToTemplateContext } from "graphql-codegen-core";
import { loadTypeSchema } from "../../../utils/schema";
import { mockServer } from "graphql-tools";

describe("Card schema", () => {
  var schema, typeDefs;
  beforeAll(async () => {
    const root = `
      schema {
        query: Query
        mutation: Mutation
      }
    `;

    const typeSchemas = await Promise.all(
      ["user", "deck", "card"].map(loadTypeSchema)
    );
    typeDefs = root + typeSchemas.join(" ");
    schema = schemaToTemplateContext(buildSchema(typeDefs));
  });

  test("Card has base fields", () => {
    var type = schema.types.find(t => {
      return t.name == "Card";
    });

    expect(type).toBeTruthy();

    var baseFields = {
      prompt: "String!",
      target: "String!",
      promptExample: "String!",
      targetExample: "String!",
      timeAdded: "Int!",
      nextReview: "Int!",
      intervalProgress: "Int!",
      deckId: "ID!",
      _id: "ID!"
    };

    type.fields.forEach(field => {
      var type = baseFields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  test("NewCardInput has correct fields", () => {
    var input = schema.inputTypes.find(i => i.name == "NewCardInput");
    expect(input).toBeTruthy();

    var fields = {
      prompt: "String!",
      target: "String!",
      promptExample: "String!",
      targetExample: "String!",
      timeAdded: "Int!",
      nextReview: "Int!",
      intervalProgress: "Int!",
      deckId: "ID!"
    };
    input.fields.forEach(field => {
      var type = fields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  test("UpdateCardInput has correct fields", () => {
    var input = schema.inputTypes.find(i => i.name == "UpdateCardInput");
    expect(input).toBeTruthy();

    var fields = {
      prompt: "String",
      target: "String",
      promptExample: "String",
      targetExample: "String",
      timeAdded: "Int",
      nextReview: "Int",
      intervalProgress: "Int"
    };
    input.fields.forEach(field => {
      var type = fields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  it("card query", async () => {
    var server = mockServer(typeDefs);
    var query = `
      {
        card(id: "12331") {
          prompt
          target
          promptExample
          targetExample
          timeAdded
          nextReview
          intervalProgress
          deckId
          _id
        }
      }
    `;
    await expect(server.query(query)).resolves.toBeTruthy();
    var { errors } = await server.query(query);
    expect(errors).not.toBeTruthy();
  });

  it("cards query", async () => {
    var server = mockServer(typeDefs);
    var query = `
      {
        cards(deckId: "123123") {
          target
          promptExample
          targetExample
          timeAdded
          nextReview
          intervalProgress
          deckId
          _id
        }
      }
    `;
    await expect(server.query(query)).resolves.toBeTruthy();
    var { errors } = await server.query(query);
    expect(errors).not.toBeTruthy();
  });

  it("newCard mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation CreateNewCard($input: NewCardInput!) {
        newCard(input: $input) {
          target
          promptExample
          targetExample
          timeAdded
          nextReview
          intervalProgress
          deckId
          _id
        }
      }
    `;
    var vars = {
      input: {
        prompt: "prompt",
        target: "target",
        promptExample: "prompt-example",
        targetExample: "target-example",
        timeAdded: 89234,
        nextReview: 89239,
        intervalProgress: 3,
        deckId: "1231232"
      }
    };
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars);
    expect(errors).not.toBeTruthy();
  });

  it("updateCard mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation UpdateCard($id: ID!, $input: UpdateCardInput!) {
        updateCard(id: $id, input: $input) {
          target
          promptExample
          targetExample
          timeAdded
          nextReview
          intervalProgress
          deckId
          _id
        }
      }
    `;
    var vars = {
      id: "123213",
      input: {
        prompt: "prompt",
        target: "target",
        promptExample: "prompt-example",
        targetExample: "target-example",
        timeAdded: 892347,
        nextReview: 892390,
        intervalProgress: 3
      }
    };
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars);
    expect(errors).not.toBeTruthy();
  });

  it("removeCard mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation RemoveCard($id: ID!) {
        removeCard(id: $id) {
          target
          promptExample
          targetExample
          timeAdded
          nextReview
          intervalProgress
          deckId
          _id
        }
      }
    `;
    var vars = {
      id: "123213"
    };
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars);
    expect(errors).not.toBeTruthy();
  });
});
