export const authRoles = {
  admin: ['admin'], // Only Admin has access
  user: ['admin', 'user'], // Only Admin & User has access
  guest: ['admin', 'user', 'guest'] // Everyone has access
}

// Check out app/views/users/CommentsRoutes.js
// Only Admin has CommentLists access

// const userRoutes = [
//   {
//     path: "/comments",
//     component: React.lazy(() => import("./Lists.jsx")),
//     auth: authRoles.admin <----------------
//   }
// ];