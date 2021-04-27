import React from "react";
import { authRoles } from "../../auth/authRoles";

const UsersRoutes = [
  {
    path: "/users",
    component: React.lazy(() => import("./List.jsx")),
    auth: authRoles.user
  }
];

export default UsersRoutes;
