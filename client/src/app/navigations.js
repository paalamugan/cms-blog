import { authRoles } from './auth/authRoles';

export const navigations = [
  {
    name: "Users",
    path: "/users",
    icon: "people",
    auth: authRoles.admin
  },
  {
    name: "Posts",
    path: "/posts",
    icon: "vertical_split",
    auth: authRoles.user
  },
  {
    name: "Comments",
    path: "/comments",
    icon: "chat",
    auth: authRoles.admin
  },
  {
    name: "Profile",
    path: "/profile",
    icon: "person",
  }
];

export default navigations;
