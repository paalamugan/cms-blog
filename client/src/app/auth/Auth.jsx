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
import { Redirect } from "react-router-dom";

const checkJwtAuth = async (setSessionData, refreshNavigationByUser) => {
  // You need to send token to our server to check token is valid
  // modify getUserSession method in jwtService
  let pathname = history.location.pathname;

  let isUnAuthRoutes = !!unAuthRoutes.find((route) => pathname.includes(route));
  
  if (isUnAuthRoutes) {
    return null;
  }
  
  let session = await jwtAuthService.getUserSession();

  if (session) {

    setSessionData(session);
    refreshNavigationByUser(session);

    setTimeout(() => {
      if (!session.verified) {
        history.push({
          pathname: '/signup-confirmation'
        })
      }
    }, 1000);

  } else {

    // history.push({
    //   pathname: pathname
    // });

    // jwtAuthService.logout();
  }

};

const Auth = ({ children, setSessionData, refreshNavigationByUser }) => {
  setSessionData(localStorageService.getUser());

  useEffect(() => {
    checkJwtAuth(setSessionData, refreshNavigationByUser);
  }, [setSessionData, refreshNavigationByUser]);

  return jwtAuthService.isLoggedIn() ? children : <Redirect to="/login" />
};

const mapStateToProps = state => ({
  setSessionData: PropTypes.func.isRequired,
  refreshNavigationByUser: PropTypes.func.isRequired,
});

export default connect(mapStateToProps, { setSessionData, refreshNavigationByUser })(
  Auth
);
