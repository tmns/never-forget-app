import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { isValidUsername, isValidPassword } from "../../utils/validation";
import { UserInputError } from "apollo-server-core";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 16
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      maxlength: 64
    }
  },
  { timestamps: true }
);

// hooks

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    var hash = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
  } catch (err) {
    return next(err);
  }
});

// instance methods

userSchema.methods.checkPassword = async function(password) {
  var passwordHash = this.password;
  return await bcrypt.compare(password, passwordHash);
};

// static functions

userSchema.statics.createUser = async function(username, password) {
  if (!isValidUsername(username) || !isValidPassword(password)) {
    throw new UserInputError("Invalid username or password");
  }

  var users = await this.find({});
  var userNames = users.map(userObject => userObject.username);

  if (userNames.includes(username)) {
    throw new UserInputError(`Another user with username '${username}' already exists.`);
  }

  return await this.create({
    username,
    password
  });
};

userSchema.statics.findAndUpdateUsername = async function(session, username) {
  if (!isValidUsername(username)) {
    throw new UserInputError(
      "Invalid username. Must be between two and sixteen characters."
    );
  }
  if (session.user.username == username) {
    throw new UserInputError(
      "New username must be different than current username."
    );
  }
  var user = await this.findByIdAndUpdate(
    session.user._id,
    { username },
    {
      useFindAndModify: false,
      new: true
    }
  )
    .lean()
    .exec();

  session.user.username = username;

  return { _id: user._id, username: user.username };
};

userSchema.statics.findAndUpdatePassword = async function(session, password) {
  if (!isValidPassword(password)) {
    throw new UserInputError(
      "Invalid password. Must be between eight and thirty two characters."
    );
  }

  var passwordHash = await bcrypt.hash(password, 12);

  var user = await this.findByIdAndUpdate(
    session.user._id,
    { password: passwordHash },
    {
      useFindAndModify: false,
      new: true
    }
  )
    .lean()
    .exec();

  return { _id: user._id, username: user.username };
};

userSchema.statics.removeUser = async function(session) {
  var removedUser = session.user;
  await session.destroy();
  await User.findByIdAndDelete(session.user._id);
  return removedUser;
};

export const User = mongoose.model("user", userSchema);
