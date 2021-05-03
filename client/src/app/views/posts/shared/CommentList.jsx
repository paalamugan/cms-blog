import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from"react-redux";
/* eslint-disable no-unused-vars */
import { Grid, Card, Avatar } from "@material-ui/core";
import moment from "moment";

const CommentList = ({ username, comments = [] }) => {

  return (
    <Fragment>
      <h6 className="font-bold mb-3">Comments ({comments.length})</h6>
      <Grid container direction="column" spacing={1}>
        { comments.length ? comments.map((comment) => (
          <Grid key={comment._id} item xs>
            <Card className="p-3" elevation={2}>
              <div className="flex justify-start items-center whitespace-pre-wrap">
                <Avatar src={comment.user?.avatarUrl || '/assets/images/avatar.png'}></Avatar>
                <div className="ml-3 flex-grow">
                  <p className="my-2"><b>{comment.user?.username || username}</b>&nbsp;
                    <span className="text-muted">at <i>{moment(comment.createdAt).format('YYYY-MM-DD hh:mm a')}</i></span>
                  </p>
                  <p className="my-2">{comment.message}</p>
                </div>
              </div>
            </Card>
          </Grid>)) : null
        }
      </Grid>
    </Fragment>
  )
}

const mapPropsToState = (state) => ({
  username: state.session.username
});

CommentList.propTypes = {
  username: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired
}

export default connect(mapPropsToState, {})(CommentList);
