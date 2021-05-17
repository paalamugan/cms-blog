import { refreshNavigationByUser } from './NavigationAction';
import history from "history.js";
import jwtAuthService from "app/services/jwtAuthService";
import { auth } from "app/services/backendService";

export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const RESET_PASSWORD = "RESET_PASSWORD";
export const FORGET_PASSWORD = "FORGET_PASSWORD";

export function loginErrorMessage(message) {
  return dispatch => {
    return dispatch({
      type: LOGIN_ERROR,
      payload: message
    });
  };
}

export function loginWithEmailAndPassword({ email, password }) {
  return (dispatch, getState) => {
    dispatch({
      type: LOGIN_LOADING
    });

    jwtAuthService
      .loginWithEmailAndPassword(email, password)
      .then(({ success, data }) => {

        if (!success) {
          return loginErrorMessage(data)(dispatch);
        }

        refreshNavigationByUser(data.user)(dispatch, getState);

        let pathname = data.user.verified ? "/" : "/signup-confirmation";

        history.push({ 
          pathname 
        });

        return dispatch({
          type: LOGIN_SUCCESS
        });
      })
  };
}

export function forgetPassword({ email, captcha }) {
  return dispatch => {
    
    dispatch({
      type: LOGIN_LOADING
    });

    return auth.post('/forgot-password', { email, captcha }).then((res) => {

      if (res.success) {
        dispatch({
          type: LOGIN_SUCCESS
        });
      }

      return res;
    });
  };
}

export function resetPassword({ email, password, passwordToken, confirmPassword }) {
  return dispatch => {

    dispatch({
      type: LOGIN_LOADING
    });

    return auth.post('/reset-password', { email, password, passwordToken, confirmPassword }).then((res) => {
      
      if (res.success) {
        dispatch({
          type: LOGIN_SUCCESS
        });
      }

      return res;
    });
    
  };
}

export function registerUser({ username, email, password, captcha }) {
  return (dispatch, getState) => {
    dispatch({
      type: LOGIN_LOADING
    });

    jwtAuthService
      .registerUser({ username, email, password, captcha })
      .then(({ success, data }) => {

        if (!success) {
          return loginErrorMessage(data)(dispatch);
        }

        refreshNavigationByUser(data.user)(dispatch, getState);

        history.push({
          pathname: "/signup-confirmation"
        });

        return dispatch({
          type: LOGIN_SUCCESS
        });
      })
  };
}
