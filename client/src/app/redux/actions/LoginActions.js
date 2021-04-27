import jwtAuthService from "../../services/jwtAuthService";
import { setSessionData } from "./SessionActions";
import { getNavigationByUser, resetNavigationByUser } from './NavigationAction';
import history from "history.js";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const RESET_PASSWORD = "RESET_PASSWORD";

export function loginErrorMessage(message) {
  return dispatch => {
    return dispatch({
      type: LOGIN_ERROR,
      payload: message
    });
  };
}

export function loginWithUsernameAndPassword({ username, password }) {
  return (dispatch, getState) => {
    dispatch({
      type: LOGIN_LOADING
    });

    jwtAuthService
      .loginWithUsernameAndPassword(username, password)
      .then(({ success, data }) => {

        if (!success) {
          return loginErrorMessage(data)(dispatch);
        }

        resetNavigationByUser()(dispatch);
        dispatch(setSessionData(data.user));
        getNavigationByUser()(dispatch, getState);

        history.push({
          pathname: "/"
        });

        return dispatch({
          type: LOGIN_SUCCESS
        });
      })
  };
}

export function resetPassword({ email }) {
  return dispatch => {
    dispatch({
      payload: email,
      type: RESET_PASSWORD
    });
  };
}
