import { authRoles } from "./auth/authRoles";
export const unAuthRoutes = ['/login', '/signup', '/404', '/forgot-password'];

export const isAdmin = (role) => {
    return authRoles.admin.includes(role);
}

export default { 
    unAuthRoutes 
};