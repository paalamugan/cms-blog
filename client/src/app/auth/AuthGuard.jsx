import React, { Fragment, useState, useEffect, useContext, useMemo } from "react";
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

const AuthGuard = ({ children, location, session }) => {
  const { routes } = useContext(AppContext);
  const props = useMemo(() => ({
    location,
    session
  }), [location, session])
  let [authenticated, setAuthenticated] = useState(
    getAuthStatus(props, routes)
  );

  useEffect(() => {
    if (!authenticated) {
      redirectRoute(props);
    }
  }, [authenticated, props]);
  
  useEffect(() => {
    setAuthenticated(getAuthStatus(props, routes));
  }, [setAuthenticated, routes, props]);

  return authenticated ? <Fragment>{children}</Fragment> : null;
};

const mapStateToProps = state => ({
  session: state.session
});

export default withRouter(connect(mapStateToProps)(AuthGuard));
