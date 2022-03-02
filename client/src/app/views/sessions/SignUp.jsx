import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  Hidden,
  CircularProgress,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { registerUser, loginErrorMessage } from "../../redux/actions/LoginActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { BlogCustomizedSnackbar } from "blog";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "app/constant";

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

class SignUp extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    agreement: false
  };

  snackbarRef = React.createRef();
  recaptchaRef = React.createRef();

  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.name === "agreement" ? event.target.checked : event.target.value
    });
  };

  handleFormSubmit = event => {
    let captcha = this.recaptchaRef.current.getValue();
    this.props.registerUser({ ...this.state, captcha });
  };

  onRecaptchaError = (error) => {
    this.snackbarRef.current.open({ variant: "error", message: 'Recaptcha failed!. please refresh the page and try again!' });
  }

  componentDidUpdate() {

    const { success, loading, error } = this.props.login;

    if (!success && !loading && error) {
      this.snackbarRef.current.open({ variant: "error", message: error });
      this.props.loginErrorMessage(null);
      this.recaptchaRef.current.reset();
    }
  }

  render() {
    let { username, agreement, email, password } = this.state;
    let { classes } = this.props;
    return (
      <div className="signup flex justify-center w-full h-full-screen">
        <BlogCustomizedSnackbar ref={this.snackbarRef} />
        <div className="p-8">
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
                <div className="px-9 pb-9 pt-6 h-full">
                  <Typography className="text-center mb-4" component="h6" variant="h5"><b>Sign Up</b></Typography>
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <TextValidator
                      className="mb-6 w-full"
                      variant="outlined"
                      label="Username"
                      onChange={this.handleChange}
                      type="text"
                      name="username"
                      value={username}
                      required
                      validators={["required"]}
                      errorMessages={["Username field is required"]}
                    />
                    <TextValidator
                      className="mb-6 w-full"
                      variant="outlined"
                      label="Email"
                      onChange={this.handleChange}
                      type="email"
                      name="email"
                      value={email}
                      required
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        "Email field is required",
                        "Email is not valid"
                      ]}
                    />
                    <TextValidator
                      className="mb-4 w-full"
                      label="Password"
                      variant="outlined"
                      onChange={this.handleChange}
                      name="password"
                      type="password"
                      value={password}
                      required
                      validators={["required"]}
                      errorMessages={["password field is required"]}
                    />
                    <FormControlLabel
                      className="mb-4"
                      style={{ alignItems: "start" }}
                      name="agreement"
                      onChange={this.handleChange}
                      control={<Checkbox className="pt-0 pb-0" checked={agreement} />}
                      label={<span>By clicking submit you agree to our <a href="/privacy-policy" className="MuiButton-textPrimary" target="_blank">Privacy Policy</a> and <a href="/terms-and-conditions" className="MuiButton-textPrimary" target="_blank">Terms and Conditions</a>.</span>}
                    />
                    <ReCAPTCHA
                      className="mb-4 w-full"
                      ref={this.recaptchaRef}
                      sitekey={RECAPTCHA_SITE_KEY}
                      onErrored={this.onRecaptchaError} />
                    <div className="flex flex-wrap items-center justify-center mb-4">
                      <Grid container spacing={2} direction="column">
                        <Grid item xs>
                          <div className={classes.wrapper}>
                            <Button
                              variant="contained"
                              color="primary"
                              disabled={this.props.login.loading || (!username || !email || !password || !agreement)}
                              type="submit"
                              className="w-full"
                            >
                              Register
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
  registerUser: PropTypes.func.isRequired,
  loginErrorMessage: PropTypes.func.isRequired,
  login: state.login
});

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps, { registerUser, loginErrorMessage })(SignUp))
);
