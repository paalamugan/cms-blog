import SignUp from "./SignUp";
import LogIn from "./LogIn";
import NotFound from "./NotFound";
import ForgotPassword from "./ForgotPassword";

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
    path: "/404",
    component: NotFound,
    settings
  }
];

export default sessionRoutes;
