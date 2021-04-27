import history from "history.js";
import jwtAuthService from "../../services/jwtAuthService";

export const SET_SESSION_DATA = "SET_SESSION_DATA";
export const REMOVE_SESSION_DATA = "REMOVE_SESSION_DATA";
export const SESSION_LOGGED_OUT = "SESSION_LOGGED_OUT";

export function setSessionData(user) {
  return dispatch => {
    dispatch({
      type: SET_SESSION_DATA,
      data: user
    });
  };
}

export function logoutSession() {
  return dispatch => {
    jwtAuthService.logout();

    history.push({
      pathname: "/login"
    });

    dispatch({
      type: SESSION_LOGGED_OUT
    });
  };
}