import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import {
  setLayoutSettings,
  setDefaultSettings
} from "app/redux/actions/LayoutActions";
import { logoutSession } from "app/redux/actions/SessionActions";
import { withRouter } from "react-router-dom";
// import { BlogMenu } from "blog";
import Sidenav from "../SharedCompoents/Sidenav";
import Brand from "../SharedCompoents/Brand";
import SidenavTheme from "../BlogTheme/SidenavTheme/SidenavTheme";
import { isMdScreen } from "utils";
import { merge } from "lodash";

const styles = theme => ({});

// const IconButtonWhite = withStyles(theme => ({
//   root: {
//     backgroundColor: "transparent",
//     padding: "5px"
//   }
// }))(IconButton);

// const IconSmall = withStyles(() => ({
//   root: {
//     fontSize: "1rem"
//   }
// }))(Icon);

class Layout1Sidenav extends Component {
  state = {
    hidden: true
  };

  componentDidMount() {
    // CLOSE SIDENAV ON ROUTE CHANGE ON MOBILE
    this.unlistenRouteChange = this.props.history.listen((location, action) => {
      if (isMdScreen()) {
        this.updateSidebarMode({ mode: "close" });
      }
    });

    setTimeout(() => {
      this.setState({ hidden: false });
    }, 400);
  }

  componentWillUnmount() {
    this.unlistenRouteChange();
  }

  updateSidebarMode = sidebarSettings => {
    let { settings, setLayoutSettings, setDefaultSettings } = this.props;
    const updatedSettings = merge({}, settings, {
      layout1Settings: {
        leftSidebar: {
          ...sidebarSettings
        }
      }
    });

    setLayoutSettings(updatedSettings);
    setDefaultSettings(updatedSettings);
  };

  handleSidenavToggle = () => {
    let {
      settings: {
        layout1Settings: {
          leftSidebar: { mode }
        }
      }
    } = this.props;

    this.updateSidebarMode({ mode: mode === "compact" ? "full" : "compact" });
  };

  handleSignOut = () => {
    this.props.logoutSession();
  };

  renderLogoSwitch = () => (
    // Open Brand component file to replace logo and text
    <Brand>
      <Switch
        className="sidenav__toggle show-on-pc"
        onChange={this.handleSidenavToggle}
        checked={
          !(this.props.settings.layout1Settings.leftSidebar.mode === "full")
        }
        color="secondary"
      />
    </Brand>
  );

  render() {
    let { theme, settings } = this.props;
    const sidenavTheme =
      settings.themes[settings.layout1Settings.leftSidebar.theme] || theme;
    return (
      <SidenavTheme theme={sidenavTheme} settings={settings}>
        <div className="sidenav">
          <div
            className="sidenav__hold"
            style={{
              backgroundImage: `url(${settings.layout1Settings.leftSidebar.bgImgURL})`
            }}
          >
            {!this.state.hidden && (
              <Fragment>
                {this.renderLogoSwitch()}
                <Sidenav />
              </Fragment>
            )}
          </div>
        </div>
      </SidenavTheme>
    );
  }
}

Layout1Sidenav.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  setDefaultSettings: PropTypes.func.isRequired,
  logoutSession: PropTypes.func.isRequired,
  session: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  setDefaultSettings: PropTypes.func.isRequired,
  setLayoutSettings: PropTypes.func.isRequired,
  logoutSession: PropTypes.func.isRequired,
  session: state.session,
  settings: state.layout.settings
});

export default withStyles(styles, { withTheme: true })(
  withRouter(
    connect(mapStateToProps, {
      setLayoutSettings,
      setDefaultSettings,
      logoutSession
    })(Layout1Sidenav)
  )
);
