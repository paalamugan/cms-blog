import { authRoles } from "./auth/authRoles";

export const unAuthRoutes = ['/login', '/signup', '/404', '/forgot-password', '/reset-password', '/verify', '/privacy-policy', '/terms-and-conditions'];
export const RECAPTCHA_SITE_KEY = "6LcaTNYaAAAAABAARjj0dzAHAmCYbhKnyEuAH3nh";

export const isAdmin = (role) => {
    return authRoles.admin.includes(role);
}