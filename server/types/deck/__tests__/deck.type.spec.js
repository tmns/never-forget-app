import { buildSchema } from "graphql";
import { schemaToTemplateContext } from "graphql-codegen-core";
import { loadTypeSchema } from "../../../utils/schema";
import { mockServer } from "graphql-tools";

describe("Deck schema", () => {
  var schema, typeDefs;
  beforeAll(async () => {
    const root = `
      schema {
        query: Query
        mutation: Mutation
      }
    `;

    const typeSchemas = await Promise.all(["user", "deck", "card"].map(loadTypeSchema));
    typeDefs = root + typeSchemas.join(" ");
    schema = schemaToTemplateContext(buildSchema(typeDefs));
  });

  test("Deck has base fields", () => {
    var type = schema.types.find(t => {
      return t.name == "Deck";
    });

    expect(type).toBeTruthy();

    var baseFields = {
      name: "String!",
      description: "String!",
      _id: "ID!"
    };

    type.fields.forEach(field => {
      var type = baseFields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  test('NewDeckInput has correct fields', () => {
    var input = schema.inputTypes.find(i => i.name == 'NewDeckInput');
    expect(input).toBeTruthy();

    var fields = {
      name: 'String!',
      description: 'String!'
    }
    input.fields.forEach(field => {
      var type = fields[field.name]
      expect(field.raw).toBe(type)
    })
  })

  test('UpdateDeckInput has correct fields', () => {
    var input = schema.inputTypes.find(i => i.name == 'UpdateDeckInput');
    expect(input).toBeTruthy();

    var fields = {
      name: 'String',
      description: 'String'
    }
    input.fields.forEach(field => {
      var type = fields[field.name]
      expect(field.raw).toBe(type)
    })
  })

  it('deck query', async () => {
    var server = mockServer(typeDefs);
    var query = `
      {
        deck(id: "12331") {
          name
          description
        }
      }
    `
    await expect(server.query(query)).resolves.toBeTruthy();
    var { errors } = await server.query(query)
    expect(errors).not.toBeTruthy();
  })

  it('decks query', async () => {
    var server = mockServer(typeDefs)
    var query = `
      {
        decks {
          name
          description
        }
      }
    `
    await expect(server.query(query)).resolves.toBeTruthy();
    var { errors } = await server.query(query)
    expect(errors).not.toBeTruthy();
  })

  it('newDeck mutation', async () => {
    var server = mockServer(typeDefs)
    var query = `
      mutation CreateNewDeck($input: NewDeckInput!) {
        newDeck(input: $input) {
          name
          description
        }
      }
    `
    var vars = {
      input: {
        name: 'name',
        description: 'description'
      }
    }
    await expect(server.query(query, vars)).resolves.toBeTruthy()
    var { errors } = await server.query(query, vars)
    expect(errors).not.toBeTruthy()
  })

  it('updateDeck mutation', async () => {
    var server = mockServer(typeDefs)
    var query = `
      mutation UpdateDeck($id: ID!, $input: UpdateDeckInput!) {
        updateDeck(id: $id, input: $input) {
          name
          description
        }
      }
    `
    var vars = {
      id: '123213',
      input: {
        name: 'new-name'
      }
    }
    await expect(server.query(query, vars)).resolves.toBeTruthy()
    var { errors } = await server.query(query, vars)
    expect(errors).not.toBeTruthy()
  })

  it('removeDeck mutation', async () => {
    var server = mockServer(typeDefs)
    var query = `
      mutation RemoveDeck($id: ID!) {
        removeDeck(id: $id) {
          name
          description
        }
      }
    `
    var vars = {
      id: '123213'
    }
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars)
    expect(errors).not.toBeTruthy()
  })
});
