import { findIndex } from "lodash";

import {
  GET_ALL_COMMENT,
  ADD_COMMENT,
  EDIT_COMMENT,
  DELETE_COMMENT
} from "../actions/CommentActions";
  
const initialState = {
  lists: []
};

const CommentReducer = function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_COMMENT: {
      return {
        ...state,
        lists: [...action.payload]
      };
    }
    case ADD_COMMENT: {
      return {
        ...state,
        lists: [...state.lists, action.payload]
      };
    }
    case EDIT_COMMENT: {
      const index = findIndex(state.lists, { _id: action.payload.id });
      state.lists[index] = { ...state.lists[index], status: action.payload?.data?.status };
      return {
        ...state,
        lists: [...state.lists]
      };
    }
    case DELETE_COMMENT: {
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

export default CommentReducer;
  