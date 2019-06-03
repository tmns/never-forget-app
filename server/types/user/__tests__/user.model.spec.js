import { User } from "../user.model";

describe("User model", () => {
  describe("schema", () => {
    test("username", () => {
      var username = User.schema.obj.username;
      expect(username).toEqual({
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 16
      });
    });

    test("password", () => {
      var password = User.schema.obj.password;
      expect(password).toEqual({
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        maxlength: 64
      });
    });
  });
});
