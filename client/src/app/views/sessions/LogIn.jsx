import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  Hidden,
  CircularProgress
} from "@material-ui/core";
// import FacebookIcon from '@material-ui/icons/Facebook';
import { withStyles } from "@material-ui/core/styles";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { loginWithEmailAndPassword, loginErrorMessage } from "../../redux/actions/LoginActions";
import { BlogCustomizedSnackbar } from "blog";

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
  },

  or: {
    height: "16px",
    position: "relative",
    textAlign: "center",
    '& > span': {
      color: "rgba(52, 49, 76, 0.54)",
      padding: "4px 6px",
      zIndex: 5,
      position: "relative",
      background: "#fff"
    },
    '&::after': {
      content: '""',
      top: "10px",
      left: "0",
      width: "100%",
      height: "1px",
      zIndex: 1,
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.12)"
    }
  },

  authButton: {
    width: '100%',
    marginBottom: theme.spacing(1) + 4 + 'px'
  },

  forgetPassword: {
    width: '100%',
    alignItems: "center", 
    justifyContent: "flex-end", 
    background: "none",
    '&:hover': {
      textDecoration: "underline",
      background: "initial",
    }
  }

});

class LogIn extends Component {
  state = {
    email: "",
    password: "",
    remember: false
  };

  snackbarRef = React.createRef();

  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.name === "remember" ? event.target.checked : event.target.value
    });
  };

  handleFormSubmit = event => {
    this.props.loginWithEmailAndPassword({ ...this.state });
  };

  componentDidUpdate() {

    const { success, loading, error } = this.props.login;

    if (!success && !loading && error) {
      this.snackbarRef.current.open({ variant: "error", message: error });
      this.props.loginErrorMessage(null);
    }
  }

  render() {
    let { email, password, remember } = this.state;
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
                <div className="px-8 pt-8">
                  <a href="/auth/google">
                    <Button 
                      variant="contained"
                      className={classes.authButton}
                      disableElevation
                      startIcon={<img src="/assets/images/icons/google.svg" alt="google" width="19" height="19" />}
                      >
                        Sign In With Google
                    </Button>
                  </a>

                  {/* <a href="/auth/facebook">
                    <Button 
                      variant="contained"
                      color="primary"
                      className={`${classes.authButton} bg-facebook`}
                      disableElevation
                      startIcon={<FacebookIcon />}
                      >
                        Sign In With Facebook
                    </Button>
                  </a> */}
                </div>
                <div className="mt-6 px-8">
                  <div className={classes.or}>
                    <span>Or</span>
                  </div>
                </div>

                <div className="p-8 h-full position-relative">
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <TextValidator
                      className="mb-6 w-full"
                      variant="outlined"
                      label="Email"
                      onChange={this.handleChange}
                      type="email"
                      name="email"
                      value={email}
                      validators={["required"]}
                      errorMessages={["Email field is required"]}
                    />
                    <TextValidator
                      className="mb-3 w-full"
                      label="Password"
                      variant="outlined"
                      onChange={this.handleChange}
                      name="password"
                      type="password"
                      value={password}
                      validators={["required"]}
                      errorMessages={["Password field is required"]}
                    />
                    <Grid container direction="row" justifyContent="space-between" alignItems="stretch" className="mb-1">
                      <Grid item xs style={{ alignSelf: "center" }}>
                        <FormControlLabel
                          style={{ alignItems: "center" }}
                          name="remember"
                          onChange={this.handleChange}
                          control={<Checkbox className="pt-0 pb-0" checked={remember} />}
                          label="Remember me"
                        />
                      </Grid>
                      <Grid item xs>
                        <Button
                          color="primary"
                          className={classes.forgetPassword}
                          onClick={() =>
                            this.props.history.push("/forgot-password")
                          }
                        >
                          Forgot password?
                        </Button>
                      </Grid>
                    </Grid>
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
                              Log In
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
                            className="capitalize w-full"
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              this.props.history.push("/signup")
                            }
                          >
                            Sign up
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
  loginWithEmailAndPassword: PropTypes.func.isRequired,
  loginErrorMessage: PropTypes.func.isRequired,
  login: state.login
});

export default withStyles(styles, { withTheme: true })(
  withRouter(connect(mapStateToProps, { loginWithEmailAndPassword, loginErrorMessage })(LogIn))
);
