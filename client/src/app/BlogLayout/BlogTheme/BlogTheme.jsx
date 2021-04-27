import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import CssBaseline from "@material-ui/core/CssBaseline";
import BlogCssVars from "./BlogCssVars";

// import cssVars from "css-vars-ponyfill";

const BlogTheme = ({ children, settings }) => {

  let activeTheme = { ...settings.themes[settings.activeTheme] };

  // cssVars();
  // activeTheme.direction = settings.direction;
  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <BlogCssVars> {children} </BlogCssVars>
    </ThemeProvider>
  );
};

BlogTheme.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  settings: state.layout.settings,
  setLayoutSettings: PropTypes.func.isRequired
});

export default connect(mapStateToProps, { setLayoutSettings })(BlogTheme);
