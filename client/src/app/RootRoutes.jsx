import React from "react";
import { Redirect } from "react-router-dom";

import sessionRoutes from "./views/sessions/SessionRoutes";
import postsRoutes from "./views/posts/PostsRoutes";
import usersRoutes from "./views/users/UsersRoutes";
import commentsRoutes from "./views/comments/CommentsRoutes";
import profileRoutes from "./views/profile/ProfileRoutes";

const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/posts" />
  },
  {
    path: "/#",
    exact: true,
    component: () => <Redirect to="/posts" />
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
