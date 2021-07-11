import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { classList } from "utils";
import Brand from "../SharedCompoents/Brand";

const styles = theme => ({
  topbar: {
    "& .topbar-hold": {
      backgroundColor: theme.palette.primary.main,
      height: "80px",
      "&.fixed": {
        boxShadow: theme.shadows[8],
        height: "64px"
      }
    }
  },
  brandLogo: {
    marginLeft: "50px",
    "& img": {
      height: '30px',
      marginRight: "12px"
    },
    "& .brand__text": {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "1.125rem"
    }
  }
});

class Layout1TopbarLogo extends Component {

  render() {
    let { classes, fixed } = this.props;

    return (
      <div className={`topbar ${classes.topbar}`}>
        <div className={classList({ "topbar-hold": true, fixed: fixed })}>
          <div className="flex justify-between items-center h-full">
            <a className={classes.brandLogo} href="/">
              <Brand />
            </a>
          </div>
        </div>
      </div>
    );
  }
}

Layout1TopbarLogo.propTypes = {
  settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  settings: state.layout.settings
});

export default withStyles(styles, { withTheme: true })(
  withRouter(
    connect(mapStateToProps, { })(Layout1TopbarLogo)
  )
);
