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
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "app/constant";
import { forgetPassword, loginErrorMessage } from "../../redux/actions/LoginActions";
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
  }

});
class ForgotPassword extends Component {
  state = {
    email: ""
  };

  snackbarRef = React.createRef();
  recaptchaRef = React.createRef();

  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleFormSubmit = () => {

    let captcha = this.recaptchaRef.current.getValue();

    this.props.forgetPassword({ ...this.state, captcha }).then(({ success, data }) => {

      if (!success) {
        return this.props.loginErrorMessage(data);
      }

      this.recaptchaRef.current.reset();
      this.snackbarRef.current.open({ variant: "success", autoHideDuration: 20000, html: true, message: `Your temporary password token sent to your mail <b>${this.state.email}</b>. <br/> Checkout your mail box` });
      this.setState({ email: '' });

    });
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
    let { email } = this.state;
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
                  <Typography className="text-center mb-4" component="h6" variant="h5"><b>Forget Password</b></Typography>
                  <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <TextValidator
                      className="mb-6 w-full"
                      variant="outlined"
                      label="Email"
                      onChange={this.handleChange}
                      type="email"
                      name="email"
                      value={email}
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        "this field is required",
                        "Email is not valid"
                      ]}
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
                              disabled={this.props.login.loading  || !email}
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
  forgetPassword: PropTypes.func.isRequired,
  loginErrorMessage: PropTypes.func.isRequired,
  login: state.login
});

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, { forgetPassword, loginErrorMessage })(ForgotPassword)
);
