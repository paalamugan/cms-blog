import { findIndex } from "lodash";
import {
  GET_ALL_USER,
  ADD_USER,
  EDIT_USER,
  DELETE_USER
} from "../actions/UserActions";

const initialState = {
  lists: []
};

const UserReducer = function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USER: {
      return {
        ...state,
        lists: [...action.payload]
      };
    }
    case ADD_USER: {
      return {
        ...state,
        lists: [...state.lists, action.payload]
      };
    }
    case EDIT_USER: {
      const index = findIndex(state.lists, { _id: action.payload.id });
      state.lists[index] = { ...state.lists[index], ...action.payload.data };
      return {
        ...state,
        lists: [...state.lists]
      };
    }
    case DELETE_USER: {
      const index = findIndex(state.lists, { _id: action.payload.id });
      state.lists.splice(index, 1);
      return {
        ...state,
        lists: [...state.lists]
      };
    }
    default: {
      return state;
    }
  }
};

export default UserReducer;
