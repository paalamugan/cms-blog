import React from "react";
import { withStyles, ThemeProvider } from "@material-ui/core/styles";
import { Toolbar, AppBar } from "@material-ui/core";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";

const Footer = ({ theme, settings }) => {
  const footerTheme = settings.themes[settings.footer.theme] || theme;
  const year = moment().format('YYYY');
  
  return (
    <ThemeProvider theme={footerTheme}>
      <AppBar color="primary" position="static">
        <Toolbar className="footer flex items-center">
          <div className="flex items-center justify-center container w-full">
            <p className="m-0">
              @{year} copy right resevered.
            </p>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

Footer.propTypes = {
  settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  settings: state.layout.settings
});

export default withStyles(
  {},
  { withTheme: true }
)(connect(mapStateToProps, {})(Footer));
