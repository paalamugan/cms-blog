import React, { useContext, useEffect } from "react";
import { BlogLayouts } from "./index";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import { connect } from "react-redux";
import AppContext from "app/appContext";
import {
  setLayoutSettings,
  setDefaultSettings
} from "app/redux/actions/LayoutActions";
import { isEqual, merge } from "lodash";
import { isMdScreen } from "utils";
import { BlogSuspense } from "blog";

let tempSettings;

const BlogLayoutSFC = props => {
  let appContext = useContext(AppContext);
  /* eslint-disable no-unused-vars */
  const {
    settings,
    defaultSettings,
    setLayoutSettings,
    setDefaultSettings
  } = props;

  tempSettings = settings;

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    listenWindowResize();

    if (window) {
      // LISTEN WINDOW RESIZE
      window.addEventListener("resize", listenWindowResize);
    }
    return () => {
      if (window) {
        window.removeEventListener("resize", listenWindowResize);
      }
    };
  }, []);

  useEffect(() => {
    updateSettingsFromRouter();
  }, [props.location]);

  const listenWindowResize = () => {
    let settings = tempSettings;
    if (settings.layout1Settings.leftSidebar.show) {
      let mode = isMdScreen() ? "close" : "full";
      setLayoutSettings(
        merge({}, settings, { layout1Settings: { leftSidebar: { mode } } })
      );
    }
  };

  const updateSettingsFromRouter = () => {
    const { routes } = appContext;
    const matched = matchRoutes(routes, props.location.pathname)[0];

    if (matched && matched.route.settings) {
      // ROUTE HAS SETTINGS
      const updatedSettings = merge({}, settings, matched.route.settings);
      if (!isEqual(settings, updatedSettings)) {
        setLayoutSettings(updatedSettings);
        // console.log('Route has settings');
      }
    } else if (!isEqual(settings, defaultSettings)) {
      setLayoutSettings(defaultSettings);
      // console.log('reset settings', defaultSettings);
    }
  };

  const Layout = BlogLayouts[settings.activeLayout];

  return (
    <BlogSuspense>
      <Layout {...props} />
    </BlogSuspense>
  );
};

const mapStateToProps = state => ({
  setLayoutSettings: PropTypes.func.isRequired,
  setDefaultSettings: PropTypes.func.isRequired,
  settings: state.layout.settings,
  defaultSettings: state.layout.defaultSettings
});

export default withRouter(
  connect(mapStateToProps, { setLayoutSettings, setDefaultSettings })(
    BlogLayoutSFC
  )
);
