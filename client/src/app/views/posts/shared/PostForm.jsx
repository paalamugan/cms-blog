import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from"react-redux";
 import { BlogLoading, RichTextEditor } from "blog";
import { Grid, TextField, Typography, Icon, Button } from "@material-ui/core";
import { addAndEditPost, getPostById } from "app/redux/actions/PostActions";
import { withRouter } from "react-router";
import { BlogCustomizedSnackbar } from "blog";

const PostForm = ({ addAndEditPost, getPostById, id, history }) => {

  const [state, setState] = useState({ title: '', description: '', content: '', image: null });
  const [loading, setLoading] = useState(true);

  const snackBarRef = useRef();

  const getSinglePost = useCallback((id) => {

    setLoading(true);

    if (!id) {
      setLoading(false);
      return;
    }

    getPostById(id).then(({ success, data }) => {

      if (!success) {
        snackBarRef.current.open({ message: data });
        data = null;
      }

      setState({ ...data });
      setLoading(false);
    });

  }, [getPostById]);

  useEffect(() => {
    getSinglePost(id);
  }, [getSinglePost, id]);

  const handleContentChange = contentHtml => {
    setState({ ...state, content: contentHtml });
  };

  const handleInputChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  }

  const handleInputImage = (event) => {

    let file = event.target.files[0];

    if (file && file.type && !file.type.includes('image')) {
      snackBarRef.current.open({ message: "Only supported image format(jpg, png, svg)." });
      file = null;
    }

    setState({ ...state, image: file });

  }

  const onSubmit = (status) => {
    return (event) => {

      event.preventDefault();
      event.stopPropagation();

      addAndEditPost({...state, status: status })
        .then(({ success, data }) => {

          if(!success) {
            snackBarRef.current.open({ message: data });
            return;
          }

          history.push({
            pathname: '/posts'
          });

        })
      
    }
  }

  return (
    <>
      <BlogCustomizedSnackbar ref={snackBarRef} />
      <form name="form" className="p-4" autoComplete="off">
        {loading ? <BlogLoading /> :
          (
            <Grid container spacing={1} direction="column" >
              <Grid item xs={12} md={8} lg={6}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom>
                    Title:
                  </Typography>
                  <TextField 
                    id="title"
                    name="title" 
                    label="Title" 
                    variant="outlined"
                    fullWidth
                    value={state.title}
                    required
                    onChange={handleInputChange}
                    size="small" />
                </div>
              </Grid>
              <Grid item xs={12} md={8} lg={6}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom>
                    Description:
                  </Typography>
                  <TextField 
                    id="description"
                    name="description" 
                    label="Description" 
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    required
                    value={state.description}
                    onChange={handleInputChange}
                    size="small" />
                </div>
              </Grid>
              <Grid item xs={12} md={8} lg={6}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom>
                    Image:
                  </Typography>
                  <label htmlFor="image" className="border-radius-4 upload-drop-box h-160 w-full flex justify-center items-center cursor-pointer mb-4 bg-light-gray" tabIndex="0">
                    <input accept="image/*" name="image" id="image" type="file" autoComplete="off" tabIndex="-1" className="hidden" onChange={handleInputImage} />
                    <div className="flex-column items-center">
                      <Icon className="text-muted text-48">publish</Icon>
                      <span>{ !!state.image || !!state.imageUrl ? '1 image were selected' : 'Drop your post image' }</span>
                    </div>
                  </label>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="mb-3">
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom>
                    Content:
                  </Typography>
                  <RichTextEditor
                    content={state.content}
                    handleContentChange={handleContentChange}
                    placeholder="Type text here..."
                  />
                </div>
              </Grid>
              <Grid item xs={12}>
                <div className="mb-3">
                <Button 
                    variant="contained"
                    onClick={onSubmit('draft')}
                    className="mr-3"
                    disabled={!state.title || !state.description || !state.content}
                    >
                      Save as Draft
                  </Button>
                  <Button 
                    variant="contained"
                    color="primary"
                    onClick={onSubmit('publish')}
                    disabled={!state.title || !state.description || !state.content}
                    >
                      Publish
                  </Button>
                </div>
              </Grid>
            </Grid>
          )
        }
      </form>
    </>
  )
}

const mapStateToProps = state => ({
  getPostById: PropTypes.func.isRequired,
  addAndEditPost: PropTypes.func.isRequired
})

export default withRouter(connect(mapStateToProps, { getPostById, addAndEditPost })(PostForm));
