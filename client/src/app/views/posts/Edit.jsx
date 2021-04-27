import React from "react";
import { Divider, Paper, Button, Icon } from "@material-ui/core";
import PostForm from "./shared/PostForm";

const EditPost = (props) => {

  const { id } = props.match.params;

    return (
      <div className="m-sm-30">
        <Paper elevation={3}>
          <div className="flex p-4 justify-between">
            <h4 className="m-0">Edit a Blog Post</h4>
            <Button
              variant="outlined"
              size="small"
              onClick={() => props.history.goBack()}
              startIcon={<Icon>arrow_back</Icon>}
            >
              Back
            </Button>
          </div>
          <Divider className="mb-3" />
          <PostForm id={id} />
        </Paper>
      </div>
    );
}

export default EditPost;
