import {
  SET_SESSION_DATA,
  REMOVE_SESSION_DATA,
  SESSION_LOGGED_OUT
} from "../actions/SessionActions";
  
const initialState = {};

const sessionReducer = function(state = initialState, action) {
  switch (action.type) {
    case SET_SESSION_DATA: {
      return {
        ...state,
        ...action.data
      };
    }
    case REMOVE_SESSION_DATA: {
      return {
        ...state
      };
    }
    case SESSION_LOGGED_OUT: {
      return state;
    }
    default: {
      return state;
    }
  }
};

export default sessionReducer;
  