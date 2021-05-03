import { api } from "app/services/backendService";

export const GET_ALL_COMMENT = "GET_ALL_COMMENT";
export const GET_COMMENT = "GET_COMMENT";
export const ADD_COMMENT = "ADD_COMMENT";
export const EDIT_COMMENT = "EDIT_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

export const getAllComment = () => dispatch => {
  return api.get("/comments").then(res => {
    dispatch({
      type: GET_ALL_COMMENT,
      payload: res.data
    });
    return res;
  });
};

export const addAndEditComment = ({ _id, message, post, status }) => dispatch => {

  let method = _id ? "put" : "post";

  return api[method](`/comments${_id ? `/${_id}` : ''}`, { message, status, post }).then(res => {

    if(!res.success) {
      return res;
    }

    if (_id) {
      dispatch({
        type: EDIT_COMMENT,
        payload: { id: _id, data: res.data || {} }
      });
    } else {
      dispatch({
        type: ADD_COMMENT,
        payload: res.data
      }); 
    }

    return res;

  });
};

export const getComment = (id) => dispatch => api.get(`/comments/${id}`);

export const deleteComment = (id) => dispatch => {
  return api.delete(`/comments/${id}`)
    .then(res => {
      dispatch({
        type: DELETE_COMMENT,
        payload: { id: id }
      });
      return res;
  });
};
