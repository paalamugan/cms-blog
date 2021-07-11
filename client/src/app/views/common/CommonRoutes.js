import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";

const settings = {
  activeLayout: "layout1",
  layout1Settings: {
    topbar: {
      show: false,
      logo: true
    },
    leftSidebar: {
      show: false,
      mode: "close"
    }
  },
  secondarySidebar: { show: false },
  footer: { show: false }
};

const CommonRoutes = [
    {
        path: '/privacy-policy',
        exact: true,
        component: PrivacyPolicy,
        settings
    },
    {
        path: '/terms-and-conditions',
        exact: true,
        component: TermsAndConditions,
        settings
    }
];

export default CommonRoutes;
