import React, { Component } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@material-ui/core";

class Form extends Component {

  // state = {
  //   username: this.props.username || "",
  //   email: this.props.email || "",
  //   role: this.props.role || "user",
  //   password: "",
  //   // confirmPassword: "",
  //   // mobile: "",
  // };

  componentDidMount() {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule("isPasswordMatch", value => {
      if (value !== this.props.user.password) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule("isPasswordMatch");
  }

  handleChange = event => {
    event.persist();
    // this.setState({ [event.target.name]: event.target.value });
    this.props.setUser((user) => ({ ...user, [event.target.name]: event.target.value }));
  };

  render() {

    let {
      username,
      password,
      email,
      role
    } = this.props.user;

    return (
      <div>
        <ValidatorForm
          ref="form"
          onSubmit={this.props.onSubmit}
          onError={errors => null}
        >
          <Grid container spacing={2} className="mb-0 mt-2">
            <Grid item xs={12}>
              <TextValidator
                className="mb-4 w-full"
                label="Username"
                variant="outlined"
                onChange={this.handleChange}
                type="text"
                name="username"
                value={username}
                validators={[
                  "required"
                ]}
                required
                errorMessages={["this field is required"]}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                className="mb-4 w-full"
                label="Email"
                variant="outlined"
                onChange={this.handleChange}
                type="email"
                name="email"
                value={email}
                required
                validators={["required", "isEmail"]}
                errorMessages={["this field is required", "email is not valid"]}
              />
            </Grid>
            <Grid item xs={12}>
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
                errorMessages={["this field is required"]}
              />
            </Grid>

            {/* <Grid item xs={12}>
              <TextValidator
                className="mb-4 w-full"
                label="Confirm Password"
                onChange={this.handleChange}
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                validators={["required", "isPasswordMatch"]}
                errorMessages={[
                  "this field is required",
                  "password didn't match"
                ]}
              />
            </Grid> */}

            <Grid item xs={12}>
              <div className="flex items-center">
              <div className="font-bold mr-4">Role: </div>
              <RadioGroup
                value={role}
                name="role"
                onChange={this.handleChange}
                row
              >
                <FormControlLabel
                  value="admin"
                  control={<Radio color="secondary" />}
                  label="ADMIN"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="user"
                  control={<Radio color="secondary" />}
                  label="USER"
                  labelPlacement="end"
                />
              </RadioGroup>
              </div>
            </Grid>

            {/* <Grid item xs={12}>
              <TextValidator
                className="mb-4 w-full"
                label="Mobile Nubmer"
                onChange={this.handleChange}
                type="text"
                name="mobile"
                value={mobile}
              />
            </Grid> */}
          </Grid>
        </ValidatorForm>
      </div>
    );
  }
}

export default Form;
