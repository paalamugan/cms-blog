import React, { Fragment, useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppContext from "app/appContext";

const redirectRoute = props => {
  const { location, history } = props;
  const { pathname } = location;

  history.push({
    pathname: "/login",
    state: { redirectUrl: pathname }
  });
};

const getAuthStatus = (props, routes) => {
  const { location, session } = props;
  const { pathname } = location;
  const matched = routes.find(r => r.path === pathname);
  const authenticated =
    matched && matched.auth && matched.auth.length
      ? matched.auth.includes(session.role)
      : true;

  return authenticated;
};

const AuthGuard = ({ children, ...props }) => {
  const { routes } = useContext(AppContext);
  
  let [authenticated, setAuthenticated] = useState(
    getAuthStatus(props, routes)
  );

  useEffect(() => {
    if (!authenticated) {
      redirectRoute(props);
    }
    setAuthenticated(getAuthStatus(props, routes));
  }, [setAuthenticated, authenticated, routes, props]);

  return authenticated ? <Fragment>{children}</Fragment> : null;
};

const mapStateToProps = state => ({
  session: state.session
});

export default withRouter(connect(mapStateToProps)(AuthGuard));
