import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { 
  Grid, 
  Divider } from "@material-ui/core";
import { connect } from "react-redux";
import { getAllComment } from "app/redux/actions/CommentActions";
import { 
  BlogNoData, 
  BlogLoading,
  BlogCustomizedSnackbar } from "blog";
 import CommentCard from "./shared/CommentCard"; 

const CommentLists = ({ comments, getAllComment }) => {

  const [loading, setLoading] = useState(true);
  const snackBarRef = useRef();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setLoading(true);
    getAllComment().then(() => setLoading(false));
  }, []);

  return (
    <div className="m-sm-30"> 
      <BlogCustomizedSnackbar ref={snackBarRef} />

      <div className="flex justify-between items-center items-center mb-6">
        <h3 className="m-0">All Comments</h3>
      </div>
      <Divider className="mb-6" />
      { loading ? <BlogLoading /> :
        (
          <Grid container spacing={2} direction="column" align="space-between" justify="center">
            {
              comments.length ? (
                comments.map((comment, index) => (<CommentCard key={index} {...comment} snackBarRef={snackBarRef} />))
              ) :
              (<BlogNoData className="mt-10">
              <p className="text-18 mt-6">No comments!</p>
              </BlogNoData>)
            }
          </Grid>
        )
      }
    </div>
  );
}

CommentLists.propTypes = {
  getAllComment: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  getAllComment: PropTypes.func.isRequired,
  addAndEditUser: PropTypes.func.isRequired,
  comments: state.comment.lists
})

export default connect(mapStateToProps, { getAllComment })(CommentLists);
