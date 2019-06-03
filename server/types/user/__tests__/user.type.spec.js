import { buildSchema } from "graphql";
import { schemaToTemplateContext } from "graphql-codegen-core";
import { loadTypeSchema } from "../../../utils/schema";
import { mockServer } from "graphql-tools";

describe("User schema", () => {
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
  test("User has base fields", () => {
    var type = schema.types.find(t => {
      return t.name == "User";
    });

    expect(type).toBeTruthy();

    var baseFields = {
      _id: "ID!",
      username: "String!"
    };

    type.fields.forEach(field => {
      var type = baseFields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  test("NewUserInput has correct fields", () => {
    var input = schema.inputTypes.find(i => i.name == "NewUserInput");
    expect(input).toBeTruthy();

    var fields = {
      username: "String!",
      password: "String!",
      confirmPassword: "String!"
    };

    input.fields.forEach(field => {
      var type = fields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  test("LoginUserInput has correct fields", () => {
    var input = schema.inputTypes.find(i => i.name == "LoginUserInput");
    expect(input).toBeTruthy();

    var fields = {
      username: "String!",
      password: "String!"
    };

    input.fields.forEach(field => {
      var type = fields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  test("UpdateUsernameInput has correct fields", () => {
    var input = schema.inputTypes.find(i => i.name == "UpdateUsernameInput");
    expect(input).toBeTruthy();

    var fields = {
      username: "String!",
      password: "String!"
    };

    input.fields.forEach(field => {
      var type = fields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  test("UpdatePasswordInput has correct fields", () => {
    var input = schema.inputTypes.find(i => i.name == "UpdatePasswordInput");
    expect(input).toBeTruthy();

    var fields = {
      password: "String!",
      newPassword: "String!",
      confirmPassword: "String!"
    };

    input.fields.forEach(field => {
      var type = fields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  test("DeleteAccountInput has correct fields", () => {
    var input = schema.inputTypes.find(i => i.name == "DeleteAccountInput");
    expect(input).toBeTruthy();

    var fields = {
      password: "String!"
    };

    input.fields.forEach(field => {
      var type = fields[field.name];
      expect(field.raw).toBe(type);
    });
  });

  it("isLogin query", async () => {
    var server = mockServer(typeDefs);
    var query = `
      {
        isLogin
      }
    `;
    await expect(server.query(query)).resolves.toBeTruthy();
    var { errors } = await server.query(query);
    expect(errors).not.toBeTruthy();
  });

  it("whoami query", async () => {
    var server = mockServer(typeDefs);
    var query = `
      {
        whoami {
          username
          _id
        }
      }
    `;
    await expect(server.query(query)).resolves.toBeTruthy();
    var { errors } = await server.query(query);
    expect(errors).not.toBeTruthy();
  });

  it("signup mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation signup($input: NewUserInput!) {
        signup(input: $input) {
          username
          _id
        }
      }
    `;
    var vars = {
      input: {
        username: 'test',
        password: '12345678',
        confirmPassword: '12345678'
      }
    }
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars);
    expect(errors).not.toBeTruthy();
  });

  it("login mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation login($input: LoginUserInput!) {
        login(input: $input) {
          username
          _id
        }
      }
    `;
    var vars = {
      input: {
        username: 'test',
        password: '12345678',
      }
    }
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars);
    expect(errors).not.toBeTruthy();
  });

  it("logout mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation logout {
        logout {
          username
          _id  
        }
      }
    `;
    await expect(server.query(query)).resolves.toBeTruthy();
    var { errors } = await server.query(query);
    expect(errors).not.toBeTruthy();
  });

  it("updateUsername mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation updateUsername($input: UpdateUsernameInput!) {
        updateUsername(input: $input) {
          username
          _id
        }
      }
    `;
    var vars = {
      input: {
        username: 'test',
        password: '12345678',
      }
    }
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars);
    expect(errors).not.toBeTruthy();
  });

  it("updatePassword mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation updatePassword($input: UpdatePasswordInput!) {
        updatePassword(input: $input) {
          username
          _id
        }
      }
    `;
    var vars = {
      input: {
        password: '12345678',
        newPassword: '123456789',
        confirmPassword: '123456789'
      }
    }
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars);
    expect(errors).not.toBeTruthy();
  });

  it("deleteAccount mutation", async () => {
    var server = mockServer(typeDefs);
    var query = `
      mutation deleteAccount($input: DeleteAccountInput!) {
        deleteAccount(input: $input) {
          username
          _id
        }
      }
    `;
    var vars = {
      input: {
        password: '12345678'
      }
    }
    await expect(server.query(query, vars)).resolves.toBeTruthy();
    var { errors } = await server.query(query, vars);
    expect(errors).not.toBeTruthy();
  });
});
