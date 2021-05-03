import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { 
  Button, 
  Grid, 
  Card,
  Chip
} from "@material-ui/core";

import { deleteComment, addAndEditComment } from "app/redux/actions/CommentActions";
import { ConfirmationDialog } from "blog";

const CommentCard = ({ 
  comments,
  comment,   
  snackBarRef, 
  addAndEditComment, 
  deleteComment }) => {

  const {_id, message, status, post = {}, user = {} } = comment;

  const [deleteSelectedId, setDeleteSelectedId] = useState(null);

  const getSubmitType = (status) => (status === "delete") ? deleteComment({ _id, post: post?._id }) : addAndEditComment({ _id, status, post: post?._id });

  const onSubmit = (status) => {
    return (event) => {
      getSubmitType(status)
      .then(({ success, data }) => {
        if(!success) {
          return snackBarRef.current.open({ message: data })
        }
      })
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (deleteSelectedId) {
      setDeleteSelectedId(null);
    }
  }, [comments]);

  const onConfirmDelete = () => {
    deleteComment(deleteSelectedId).then(({ success, data }) => {

      if (!success) {
        return snackBarRef.current.open({ message: data })
      }
      
    })
  }

  return (
    <>
    <ConfirmationDialog 
      open={!!deleteSelectedId} 
      title="Delete Confirm" 
      text="Are you sure you want to delete this comment? This cannot be undone."
      onYesClick={onConfirmDelete}
      onConfirmDialogClose={() => setDeleteSelectedId(null)} />

    <Grid item xs={12}>
      <Card elevation={3} className="p-5 flex justify-between items-center">
        <div className="comment-title">
          <div className="mb-2 flex items-center">
            <div className="font-bold text-20 mr-2">
              {post?.title}
            </div>
            <Chip label={status} size="small" />
            <div className="ml-3 text-14 text-muted">Created by <b>{ user?.username || 'admin'}</b></div>
          </div>
          <div>{message}</div>
        </div>
        <div className="comment-action">
        <Grid item xs={12}>
          <div>
            <Button 
              variant="contained"
              onClick={onSubmit('approved')}
              className="mr-3"
              color="primary"
              disabled={status === "approved"}
              >
                Approve{status === "approved" ? 'd': ''}
            </Button>
            <Button 
              variant="contained"
              className="mr-3"
              disabled={status === "declined"}
              onClick={onSubmit("declined")}
              >
                Decline{status === "declined" ? 'd' : ''}
            </Button>
            <Button 
              variant="outlined"
              color="primary"
              className="bg-error"
              onClick={() => setDeleteSelectedId(_id)}
              >
                Delete
            </Button>
          </div>
        </Grid>
        </div>
      </Card> 
    </Grid>
    </>
  )
}



const mapStateToProps = (state) => ({
  addAndEditComment: PropTypes.func.isRequired,
  deleteComment: PropTypes.func.isRequired,
  comments: state.comment.lists
})

export default connect(mapStateToProps, { addAndEditComment, deleteComment })(CommentCard);