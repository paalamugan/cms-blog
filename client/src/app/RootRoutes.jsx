import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import commonRoutes from "./views/common/CommonRoutes";
import postsRoutes from "./views/posts/PostsRoutes";
import usersRoutes from "./views/users/UsersRoutes";
import commentsRoutes from "./views/comments/CommentsRoutes";
import profileRoutes from "./views/profile/ProfileRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";
import history from "history.js";

const RedirectComponent = () => {
  useEffect(() => {
    history.push({
      pathname: "/posts"
    })
  }, []);
  return null;
};

const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: RedirectComponent,
  },
];

const errorRoute = [
  {
    component: () => <Redirect to="/404" />,
  },
];

const routes = [
  ...commonRoutes,
  ...sessionRoutes,
  ...usersRoutes,
  ...postsRoutes,
  ...commentsRoutes,
  ...profileRoutes,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
