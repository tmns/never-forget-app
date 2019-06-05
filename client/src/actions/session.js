import * as apiUtil from '../util/session';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';

const receiveCurrentUser = user => ({
  type: RECEIVE_CURRENT_USER,
  user
})

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
})

export const signUp = variables => async dispatch => {
  try {
    var data = await apiUtil.signUp(variables);
    return dispatch(receiveCurrentUser(data));
  } catch(err) {
    throw err;
  }
}


export const signIn = variables => async dispatch => {
  try {
    var data = await apiUtil.signIn(variables);
    return dispatch(receiveCurrentUser(data));
  } catch(err) {
    throw err;
  }
}


export const signOut = () => async dispatch => {
  try {
    await apiUtil.signOut();
    return dispatch(logoutCurrentUser());
  } catch(err) {
    throw err;
  }
}