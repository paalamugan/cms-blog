import React from "react";
import { authRoles } from "../../auth/authRoles";

const commentsRoutes = [
  {
    path: "/comments",
    component: React.lazy(() => import("./List.jsx")),
    auth: authRoles.admin
  }
];

export default commentsRoutes;
