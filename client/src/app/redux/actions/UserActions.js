import { api } from "app/services/backendService";

export const GET_ALL_USER = "GET_ALL_USER";
export const GET_USER = "GET_USER";
export const ADD_USER = "ADD_USER";
export const EDIT_USER = "EDIT_USER";
export const DELETE_USER = "DELETE_USER";

export const getAllUser = () => dispatch => {
  return api.get("/users").then(res => {
    dispatch({
      type: GET_ALL_USER,
      payload: res.data
    });
    return res;
  });
};

export const addAndEditUser = ({ _id, username, password, email, role }) => dispatch => {

  let method = _id ? "put" : "post";

  return api[method](`/users${_id ? `/${_id}` : ''}`, { username, password, email, role }).then(res => {

    if(!res.success) {
      return res;
    }

    if (_id) {
      dispatch({
        type: EDIT_USER,
        payload: { id: _id, data: res.data || {} }
      });
    } else {
      dispatch({
        type: ADD_USER,
        payload: res.data
      }); 
    }

    return res;

  });
};

export const getUser = (id) => dispatch => api.get(`/users/${id}`);

export const deleteUser = (id) => dispatch => {
  return api.delete(`/users/${id}`)
    .then(res => {
      dispatch({
        type: DELETE_USER,
        payload: { id: id }
      });
      return res;
  });
};
