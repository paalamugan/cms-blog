import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import moment from "moment";
import { 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Typography, 
  Icon,
  Divider } from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getAllPost, deletePost } from "app/redux/actions/PostActions";
import { 
  BlogNoData, 
  BlogLoading, 
  ConfirmationDialog, 
  BlogCustomizedSnackbar } from "blog";
import { isAdmin } from "app/constant";

const List  = ({ getAllPost, deletePost, post, session, location : { pathname } }) => {

  const [loading, setLoading] = useState(true);
  const [deleteSelectedId, setDeleteSelectedId] = useState(null);
  const snackBarRef = useRef();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {

    if (session.username) {
      setLoading(true);
      getAllPost().then(() => setLoading(false));
    }

  }, []);
  
  const onConfirmDelete = () => {
    deletePost(deleteSelectedId).then(({ success, data }) => {
      if (!success) {
        return snackBarRef.current.open({ message: data })
      }
      setDeleteSelectedId(null);
    })
  }

  return (
    <div className="m-sm-30">
      <BlogCustomizedSnackbar ref={snackBarRef} />
      <ConfirmationDialog 
        open={!!deleteSelectedId} 
        title="Delete Confirm" 
        text="Are you sure you want to delete this post? This cannot be undone."
        onYesClick={onConfirmDelete}
        onConfirmDialogClose={() => setDeleteSelectedId(null)} />

      <div className="flex justify-between items-center items-center mb-6">
        <h3 className="m-0">Latest Posts</h3>
        {
          isAdmin(session.role) ?
            (<Link to={`${pathname}/add`}>
              <Button
                variant="contained"
                color="primary">
                  Create a new post
              </Button>
            </Link>) : null
        }
      </div>
      <Divider className="mb-6" />
      { loading ? <BlogLoading /> : 
        (<Grid container spacing={3}>
          { 
            post.lists.length ? (post.lists.map((list) => (
              <Grid key={list._id} item lg={4} md={6} sm={12} xs={12}>
                <Card elevation={6}>
                  <CardMedia
                    component="img"
                    alt={list.title}
                    height="180"
                    image={list.imageUrl}
                    title={list.title}
                  />
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      <Link to={`${pathname}/${list.slug}`} className="text-primary">
                        {list.title}
                      </Link>
                    </Typography>
                    <div className="mb-3">
                      <div className="text-14 text-muted">
                        <i>{ moment(list.createdAt).format('MMM DD, YYYY') }</i>
                      </div>
                    </div>
                    <Typography variant="body2" color="textPrimary" className="text-16" component="p">
                      {list.description}
                    </Typography>
                  </CardContent>
                  { isAdmin(session.role) ? 
                  (<CardActions className="mb-5 mr-5 justify-end">
                    <Link to={`${pathname}/edit/${list._id}`}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="secondary"
                        className={'text-white'}
                        startIcon={<Icon className="text-16">edit</Icon>}>
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="default"
                      onClick={() => setDeleteSelectedId(list._id)}
                      startIcon={<Icon className="text-16">delete</Icon>}>
                      Delete
                    </Button>
                  </CardActions>) : null}
                </Card>
              </Grid>))
            ) : 
            (<BlogNoData className="mt-10">
              <p className="text-18 mt-6">Yet no posts created!</p>
              {isAdmin(session.role) ? 
                (<Link to={`${pathname}/add`}>
                  <Button
                    className="uppercase"
                    size="large"
                    variant="contained"
                    color="primary"
                  >
                    Create a new Post
                  </Button>
                </Link>) : null
              }
            </BlogNoData>)
          }
        </Grid>)
      }
    </div>
  );
}

List.propTypes = {
  getAllPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  getAllPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  post: state.post,
  session: state.session
});

export default connect(mapStateToProps, { getAllPost, deletePost })(List);
