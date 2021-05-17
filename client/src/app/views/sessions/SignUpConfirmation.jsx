import React, { Component } from "react";
import { Button, Icon, Paper, Divider } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { Link } from 'react-router-dom';
import { BlogCustomizedSnackbar } from "blog";
import { connect } from "react-redux";

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
    maxWidth: "600px",
    padding: theme.spacing(4)
  }
});

class SignUpConfirmation extends Component {

  snackbarRef = React.createRef();

  componentDidMount() {
    if (!this.props?.session?.email) {
      this.props.history.push('/login');
    } else if (this.props?.session?.verified) {
      this.props.history.push('/');
    }
  }

  render() {
    const { classes, session } = this.props;
    return (
      <div className={`signup ${classes.flexCenter} ${classes.wrapper}`}>
        <BlogCustomizedSnackbar ref={this.snackbarRef} />
        <Paper className={`bg-white ${classes.flexCenter} ${classes.inner}`}>
          <div className="text-left mb-4">
            <h4 className="text-center">Confirm your email!</h4>
            <p>Thanks for Signing Up. We’ve sent you an email to <strong>{ session.email }</strong></p>
            <p>Please find the email and click the confirmation link to activate your account.</p>
            <Divider />
            <p className="text-muted">
              If you do not receive an email in 5 minutes, please check your spam folder or email us at <em>paalamugan26@gmail.com</em>
            </p>
          </div>
          <Link to="/login">
            <Button
              className="capitalize"
              variant="contained"
              color="primary"
              startIcon={<Icon fontSize="large">arrow_backward</Icon>}
            >
              Back to Login
            </Button>
          </Link>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  session: state.session
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, {})(SignUpConfirmation)
);
