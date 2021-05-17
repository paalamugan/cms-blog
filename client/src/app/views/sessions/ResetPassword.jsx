import React, { Component } from "react";
import PropTypes from "prop-types";
import { 
  Card, 
  Grid, 
  Button, 
  Hidden,
  CircularProgress,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { resetPassword, loginErrorMessage } from "../../redux/actions/LoginActions";
import { BlogCustomizedSnackbar } from "blog";
import backendService from 'app/services/backendService';

const styles = theme => ({
  wrapper: {
    position: "relative",
    width: "100%"
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }

});

class ResetPassword extends Component {

  state = {
    email: "",
    passwordToken: "",
    password: "",
    confirmPassword: ""
  };

  snackbarRef = React.createRef();

  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {

    this.props.resetPassword({ ...this.state })
    .then(({ success, data }) => {

      if (!success) {
        return this.props.loginErrorMessage(data);
      }

      this.snackbarRef.current.open({ variant: "success", message: `Your password was successfully changed.` });
      
      setTimeout(() => {
        this.props.history.push({
          pathname: '/login'
        });
      }, 2000);

    });

  };

  componentDidMount() {

    let query = backendService.queryParse(this.props.location.search);

    if (query) {
      this.setState({ email: query.email, passwordToken: query.token });
    }

    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
          return false;
      }
      return true;
    });
  }

  componentDidUpdate() {

    const { success, loading, error } = this.props.login;

    if (!success && !loading && error) {
      this.snackbarRef.current.open({ variant: "error", message: error });
      this.props.loginErrorMessage(null);
    }

  }

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }

  render() {
    let { email, passwordToken, password, confirmPassword } = this.state;
    let { classes } = this.props;

    return (
      <div className="signup flex justify-center w-full h-full-screen">
        <div className="p-8">
          <BlogCustomizedSnackbar ref={this.snackbarRef} />
          <Card className="signup-card position-relative y-center">
            <Grid container>
              <Hidden xsDown>
                <Grid item lg={5} md={5} sm={5} xs={12}>
                  <div className="flex justify-center items-center h-full">
                    <img src="/assets/images/sq-2.jpg" alt="sq" className="h-full" />
                  </div>
                </Grid>
              </Hidden>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="px-9 pb-9 pt-6 h-full position-relative">
                  <Typography className="text-center mb-4" component="h6" variant="h5"><b>Reset Password</b></Typography>
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <TextValidator
                      className="mb-3 w-full"
                      variant="outlined"
                      label="Email"
                      onChange={this.handleChange}
                      type="email"
                      name="email"
                      value={email}
                      disabled={true}
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        "Email field is required",
                        "Email is not valid"
                      ]}
                    />
                    <TextValidator
                      className="mb-3 w-full"
                      label="Temporary Password Token"
                      variant="outlined"
                      onChange={this.handleChange}
                      name="passwordToken"
                      type="password"
                      value={passwordToken}
                      disabled={true}
                      validators={["required"]}
                      errorMessages={["Password token field is required"]}
                    />
                    <TextValidator
                      className="mb-3 w-full"
                      label="New Password"
                      variant="outlined"
                      onChange={this.handleChange}
                      name="password"
                      type="password"
                      value={password}
                      validators={["required"]}
                      errorMessages={["Password field is required"]}
                    />
                    <TextValidator
                      className="mb-3 w-full"
                      label="Confirm New Password"
                      variant="outlined"
                      onChange={this.handleChange}
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      validators={["isPasswordMatch", "required"]}
                      errorMessages={["Password mismatch", "Confirm Password field is required"]}
                    />
                    <div className="flex flex-wrap items-center justify-center mb-4">
                      <Grid container spacing={2} direction="column">
                        <Grid item xs>
                          <div className={classes.wrapper}>
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={this.props.login.loading}
                              type="submit"
                              className="w-full"
                            >
                              Submit
                            </Button>
                            {this.props.login.loading && (
                              <CircularProgress
                                size={24}
                                className={classes.buttonProgress}
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs>
                          <Button
                            className="w-full"
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              this.props.history.push("/login")
                            }
                          >
                            Go to Log In
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </ValidatorForm>
                </div>
              </Grid>
            </Grid>
          </Card>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  resetPassword: PropTypes.func.isRequired,
  loginErrorMessage: PropTypes.func.isRequired,
  login: state.login
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, { resetPassword, loginErrorMessage })(ResetPassword)
);
