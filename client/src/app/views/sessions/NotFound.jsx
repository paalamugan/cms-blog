import React, { Component } from "react";
import { Button, Icon } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Link } from 'react-router-dom';

const styles = theme => ({
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  wrapper: {
    width: "100%",
    height: "100vh"
  },
  inner: {
    flexDirection: "column",
    maxWidth: "320px"
  }
});

class NotFound extends Component {
  state = {};

  render() {
    const { classes } = this.props;
    return (
      <div className={`${classes.flexCenter} ${classes.wrapper}`}>
        <div className={`${classes.flexCenter} ${classes.inner}`}>
          <img
            className="mb-8"
            src="/assets/images/illustrations/404.svg"
            alt=""
          />
          <Link to="/posts">
            <Button
              className="capitalize"
              variant="contained"
              color="primary"
              startIcon={<Icon fontSize="large">arrow_backward</Icon>}
            >
              Back to Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NotFound);
