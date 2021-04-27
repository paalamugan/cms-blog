import React from "react";

const profileRoutes = [
  {
    path: "/profile",
    component: React.lazy(() => import('./Profile.jsx'))
  }
];

export default profileRoutes;
