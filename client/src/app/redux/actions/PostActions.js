import { api } from "app/services/backendService";

export const GET_ALL_POST = "GET_ALL_POST";
export const GET_POST = "GET_POST";
export const ADD_POST = "ADD_POST";
export const EDIT_POST = "EDIT_POST";
export const DELETE_POST = "DELETE_POST";

export const getAllPost = () => dispatch => {
  return api.get("/posts").then(res => {
    let posts = res.success ? res.data : [];
    dispatch({
      type: GET_ALL_POST,
      payload: posts
    });
    return res;
  });
};

export const addAndEditPost = ({ _id, title, description, content, image, status }) => dispatch => {

  let method = _id ? "put" : "post";

  let form = new FormData();
  
  form.append('title', title);
  form.append('description', description);
  form.append('content', content);
  form.append('image', image);
  form.append('status', status);

  return api[method](`/posts${_id ? `/${_id}` : ''}`, form);

};

export const getPostById = (id) => dispatch => api.get(`/posts/${id}`);

export const getPostBySlug = (slug) => dispatch => api.get(`/posts/slug/${slug}`);

export const deletePost = (id) => dispatch => {
  return api.delete(`/posts/${id}`)
    .then(res => {

      if (res.success) {
        dispatch({
          type: DELETE_POST,
          payload: { id: id }
        });
      }

      return res;
  });
};
