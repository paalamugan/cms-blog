/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setSessionData } from "../redux/actions/SessionActions";
import { refreshNavigationByUser } from "../redux/actions/NavigationAction";
import jwtAuthService from "../services/jwtAuthService";
import localStorageService from "../services/localStorageService";
import history from "history.js";
import { unAuthRoutes } from "app/constant";

const checkJwtAuth = async (setSessionData, refreshNavigationByUser) => {
  // You need to send token to our server to check token is valid
  // modify getUserSession method in jwtService

  let session = await jwtAuthService.getUserSession();

  if (session) {
    setSessionData(session);
    refreshNavigationByUser(session);

    setTimeout(() => {
      if (!session.verified) {
        history.push({
          pathname: "/signup-confirmation",
        });
      }
    }, 1000);
  } else {
    // history.push({
    //   pathname: pathname
    // });
    // jwtAuthService.logout();
  }
};

const AuthorizedComponent = ({
  children,
  setSessionData,
  refreshNavigationByUser,
}) => {
  let pathname = history.location.pathname;
  let isunAuthRoutes = !!unAuthRoutes.find((route) => pathname.includes(route));

  useEffect(() => {
    if (isunAuthRoutes) return;
    setSessionData(localStorageService.getUser());
    checkJwtAuth(setSessionData, refreshNavigationByUser);
  }, [setSessionData, refreshNavigationByUser]);
  return children;
};

const Auth = ({ children, setSessionData, refreshNavigationByUser }) => {
  return (
    <AuthorizedComponent
      setSessionData={setSessionData}
      refreshNavigationByUser={refreshNavigationByUser}
    >
      {children}
    </AuthorizedComponent>
  );
};

const mapStateToProps = (state) => ({
  setSessionData: PropTypes.func.isRequired,
  refreshNavigationByUser: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, {
  setSessionData,
  refreshNavigationByUser,
})(Auth);
