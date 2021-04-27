import React, { Component } from "react";
import { Divider, Paper, Button, Icon } from "@material-ui/core";
import PostForm from "./shared/PostForm";

class AddPost extends Component {

  render() {
    return (
      <div className="m-sm-30">
        <Paper elevation={3}>
          <div className="flex p-4 justify-between">
            <h4 className="m-0">Create a New Blog Post</h4>
            <Button
              variant="outlined"
              size="small"
              onClick={() => this.props.history.goBack()}
              startIcon={<Icon>arrow_back</Icon>}
            >
              Back
            </Button>
          </div>
          <Divider className="mb-3" />
          <PostForm />
        </Paper>
      </div>
    );
  }
}

export default AddPost;
