import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  Icon,
  Divider 
} from "@material-ui/core";
import PropTypes from 'prop-types';
import { getPostBySlug } from "app/redux/actions/PostActions";
import { addAndEditComment } from "app/redux/actions/CommentActions";
import { connect } from "react-redux";
import { BlogCustomizedSnackbar, BlogNoData, BlogLoading } from "blog";
import CommentList from "./shared/CommentList";
import { authRoles } from "app/auth/authRoles";

const Show = ({ role, getPostBySlug, addAndEditComment, match: { params: { slug }} }) => {

  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const snackBarRef = useRef();
  const [comment, setComment] = useState('');

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setLoading(true);
    getPostBySlug(slug).then(({ success, data }) => {
      if (!success) {
        snackBarRef.current.open({ message: data });
        data = null;
      }
      setState(data);
      setLoading(false);
    })
  }, []);

  const handleSubmit = () => {
    addAndEditComment({ message: comment, post: state._id })
    .then(({ success, data }) => {

      if (!success) {
        return snackBarRef.current.open({ message: data });
      }

      if (!authRoles.admin.includes(role)) {
        return snackBarRef.current.open({ variant: 'success', message: 'Comments was successfully sent. But Admin has to be approve your comment!' });
      }

      setState({
        ...state,
        comments: [data, ...state.comments]
      });

      setComment('');

    })
  }

  return (
    <div className="m-sm-30">
      <BlogCustomizedSnackbar ref={snackBarRef} />
      {loading ? <BlogLoading /> :
        (
          state?.title ? (
            <Grid container justify="center" className="pb-5">
              <Grid item xs={12} sm={12} lg={8} className="mt-10">
                <div className="flex flex-wrap items-center justify-center">
                  <h1>{state.title}</h1>
                </div>
                <p className="text-bold font-18">Post Created at: <i><b>{moment(state.createdAt).format('MMM DD, YYYY')}</b></i></p>
                <Grid item xs>
                  <img src={state.imageUrl || state.defaultImageUrl} alt={state.title} className="post-image" />
                </Grid>
                <Grid item xs className="mb-10">
                  <Typography className="mt-5" gutterBottom variant="h5" component="h2" >
                    <i>Description</i>
                  </Typography>
                    <p>{state.description}</p>
                </Grid>
                <Typography variant="h5" component="h2" >
                  <i>Content</i>
                </Typography>
                <Grid container className="blog-post-content mb-4">
                  <Grid item xs>
                    <div dangerouslySetInnerHTML= {{ __html: state.content }}></div>
                  </Grid>
                </Grid>
                <Grid container direction="column">
                  <Grid item xs>
                    <TextField
                      fullWidth
                      id="post-comment"
                      label="Comments"
                      multiline
                      rows={4}
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      variant="outlined" />
                  </Grid>
                  <div className="flex justify-end mt-4">
                    <Button 
                      color="primary" 
                      variant="contained"
                      onClick={handleSubmit} 
                      disabled={!comment}
                      type="submit">
                        <Icon>send</Icon>
                        <span className="pl-2 capitalize">Send Comment</span>
                    </Button>
                  </div>
                </Grid>
                <Divider className="mt-6 mb-5" />
                <CommentList comments={state.comments} />
              </Grid>
            </Grid>
          ) : (<BlogNoData />)
        )
      }
    </div>
  );
}

const mapStateToProps = state => ({
  role: state.session.role,
  getPostBySlug: PropTypes.func.isRequired,
  addAndEditComment: PropTypes.func.isRequired
})

export default connect(mapStateToProps, { getPostBySlug, addAndEditComment })(Show);
