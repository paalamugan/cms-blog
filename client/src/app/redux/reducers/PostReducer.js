import { findIndex } from "lodash";
import {
    GET_ALL_POST,
    ADD_POST,
    EDIT_POST,
    DELETE_POST
  } from "../actions/PostActions";

const initialState = {
  lists: []
};

const PostReducer = function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_POST: {
      return {
        ...state,
        lists: [...action.payload]
      };
    }
    case ADD_POST: {
      return {
        ...state,
        lists: [...state.lists, action.payload]
      };
    }
    case EDIT_POST: {
      const index = findIndex(state.lists, { _id: action.payload.id });
      state.lists[index] = { ...state.lists[index], ...action.payload.data };
      return {
        ...state,
        lists: [...state.lists]
      };
    }
    case DELETE_POST: {
      const index = findIndex(state.lists, { _id: action.payload.id });
      state.lists.splice(index, 1);
      return state;
    }
    default: {
      return state;
    }
  }
};

export default PostReducer;
  