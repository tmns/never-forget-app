"use strict";

import { User } from "./user.model";

import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from "apollo-server-core";

import {
  isAuthenticated,
  isAuthorized,
  loginUser,
  logoutUser
} from "../../utils/auth";

function isLogin(_, args, ctx) {
  return isAuthenticated(ctx.session);
}

function whoami(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("User not authenticated");
  }
  return ctx.session.user;
}

async function updateUsername(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("User not authenticated");
  }

  if (!(await isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  try {
    return await User.findAndUpdateUsername(
      ctx.session,
      args.input.username.trim()
    );
  } catch (err) {
    throw err;
  }
}

async function updatePassword(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("User not authenticated");
  }

  if (!(await isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  if (args.input.password == args.input.newPassword) {
    throw new UserInputError(
      "New password must be different than current password."
    );
  }

  if (args.input.newPassword != args.input.confirmPassword) {
    throw new UserInputError("Passwords do not match");
  }

  try {
    return await User.findAndUpdatePassword(
      ctx.session,
      args.input.newPassword.trim()
    );
  } catch (err) {
    throw err;
  }
}

async function signup(_, args, ctx) {
  if (isAuthenticated(ctx.session)) {
    throw new ForbiddenError("User already registered and authenticated");
  }

  if (args.input.password != args.input.confirmPassword) {
    throw new UserInputError("Passwords do not match.");
  }

  try {
    return await User.createUser(
      args.input.username.trim(),
      args.input.password.trim()
    );
  } catch (err) {
    throw err;
  }
}

async function login(_, args, ctx) {
  if (isAuthenticated(ctx.session)) {
    throw new ForbiddenError("User already authenticated");
  }
  try {
    return await loginUser(
      args.input.username,
      args.input.password,
      ctx.session
    );
  } catch (err) {
    throw err;
  }
}

async function logout(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("User not authenticated");
  }
  return await logoutUser(ctx.session);
}

async function deleteAccount(_, args, ctx) {
  if (!isAuthenticated(ctx.session)) {
    throw new AuthenticationError("User not authenticated");
  }

  if (!(await isAuthorized(ctx.session.user._id, args.input.password))) {
    throw new ForbiddenError("Invalid password.");
  }

  return await User.removeUser(ctx.session);
}

export default {
  Query: {
    whoami,
    isLogin
  },
  Mutation: {
    updateUsername,
    updatePassword,
    signup,
    login,
    logout,
    deleteAccount
  }
};
