import SignUp from "./SignUp";
import LogIn from "./LogIn";
import NotFound from "./NotFound";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import AccountVerify from "./AccountVerify";
import SignUpConfirmation from "./SignUpConfirmation";

const settings = {
  activeLayout: "layout1",
  layout1Settings: {
    topbar: {
      show: false
    },
    leftSidebar: {
      show: false,
      mode: "close"
    }
  },
  layout2Settings: {
    mode: "full",
    topbar: {
      show: false
    },
    navbar: { show: false }
  },
  secondarySidebar: { show: false },
  footer: { show: false }
};

const sessionRoutes = [
  {
    path: "/signup",
    component: SignUp,
    settings
  },
  {
    path: "/signup-confirmation",
    component: SignUpConfirmation,
    settings
  },
  {
    path: "/login",
    component: LogIn,
    settings
  },
  {
    path: "/forgot-password",
    component: ForgotPassword,
    settings
  },
  {
    path: "/reset-password",
    component: ResetPassword,
    settings
  },
  {
    path: "/verify/:token",
    component: AccountVerify,
    settings
  },
  {
    path: "/404",
    component: NotFound,
    settings
  }
];

export default sessionRoutes;
