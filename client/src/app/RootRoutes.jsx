import React, { useLayoutEffect } from "react";
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom";
import { getNavigationByUser } from "./redux/actions/NavigationAction";

import sessionRoutes from "./views/sessions/SessionRoutes";
import postsRoutes from "./views/posts/PostsRoutes";
import usersRoutes from "./views/users/UsersRoutes";
import commentsRoutes from "./views/comments/CommentsRoutes";
import profileRoutes from "./views/profile/ProfileRoutes";
import { connect } from "react-redux";

const RootComponent = ({ getNavigationByUser }) => {

  useLayoutEffect(() => {
    getNavigationByUser();
  }, [getNavigationByUser]);

  return (
    <Redirect to="/posts" />
  )
}

const mapStateToProps = state => ({
  getNavigationByUser: PropTypes.func.isRequired,
});

const ReduxRootComponent = connect(mapStateToProps, { getNavigationByUser })(RootComponent);

const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: ReduxRootComponent 
  },
  {
    path: "/#",
    exact: true,
    component: ReduxRootComponent
  }
];

const errorRoute = [
  {
    component: () => <Redirect to="/404" />
  }
];

const routes = [
  ...sessionRoutes,
  ...usersRoutes, 
  ...postsRoutes,
  ...commentsRoutes,
  ...profileRoutes,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
