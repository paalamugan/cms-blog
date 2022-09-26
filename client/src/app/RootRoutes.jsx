import React from "react";
import { Redirect } from "react-router-dom";
import commonRoutes from "./views/common/CommonRoutes";
import postsRoutes from "./views/posts/PostsRoutes";
import usersRoutes from "./views/users/UsersRoutes";
import commentsRoutes from "./views/comments/CommentsRoutes";
import profileRoutes from "./views/profile/ProfileRoutes";
import jwtAuthService from "./services/jwtAuthService";
import sessionRoutes from "./views/sessions/SessionRoutes";

const RedirectComponent = () => {
  console.log("Asasasas");
  if (!jwtAuthService.isLoggedIn()) return <Redirect to="/login" />;
  return <Redirect to="/posts" />;
};

const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: RedirectComponent,
  },
  {
    path: "/#_=_",
    exact: true,
    component: () => <Redirect to="/posts" />,
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
