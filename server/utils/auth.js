'use strict';

import { User } from "../types/user/user.model";
import { UserInputError } from "apollo-server-core";
import { isValidUsername, isValidPassword} from './validation';

function isAuthenticated(session) {
  return session.user != undefined;
}

async function isAuthorized(userId, password) {
  if (password == "") {
    return false;
  }

  var user = await User.findById(userId);
  return await user.checkPassword(password);
}

async function loginUser(username, password, session) {
  if (isValidUsername && isValidPassword) {
    var user = await User.findOne({ username });
    if (user != null && (await user.checkPassword(password))) {
      session.user = {
        _id: user._id,
        username: user.username
      };
      return session.user;
    }
  }
  throw new UserInputError("Invalid username or password.");
}

async function logoutUser(session) {
  var loggedOutUser = session.user;
  await session.destroy();
  return loggedOutUser;
}

export {
  isAuthenticated,
  isAuthorized,
  loginUser,
  logoutUser
}