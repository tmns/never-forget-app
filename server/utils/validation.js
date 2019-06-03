function isValidUsername(username) {
  var length = username.length;
  return length >= 2 && length <= 16;
}

function isValidPassword(password) {
  var length = password.length;
  return length >= 8 && length <= 64;
}

function hasValidInputs({ prompt, target, promptExample, targetExample }) {
  if (prompt.length < 1 || prompt.length > 300) {
    return false;
  }
  if (target.length < 1 || target.length > 300) {
    return false;
  }
  if (promptExample.length > 300 || targetExample.length > 300) {
    return false;
  }
  return true;
}

export { isValidUsername, isValidPassword, hasValidInputs };
