import React from "react";
import { authRoles } from "../../auth/authRoles";

const postsRoutes = [
  {
    path: "/posts",
    component: React.lazy(() => import("./List.jsx")),
    exact: true,
  },
  {
    path: "/posts/add",
    component: React.lazy(() => import("./Add.jsx")),
    auth: authRoles.admin
  },
  {
    path: "/posts/edit/:id",
    component: React.lazy(() => import("./Edit.jsx")),
    auth: authRoles.admin
  },
  {
    path: "/posts/:slug",
    component: React.lazy(() => import("./Show.jsx"))
  },
];

export default postsRoutes;
