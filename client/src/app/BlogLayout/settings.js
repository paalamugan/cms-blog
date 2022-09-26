import layout1Settings from "./Layout1/Layout1Settings";
import { themeColors } from "./BlogTheme/themeColors";
import { createTheme } from "@material-ui/core/styles";
import { forEach, merge } from "lodash";
import themeOptions from "./BlogTheme/themeOptions";

function createBlogThemes() {
  let themes = {};

  forEach(themeColors, (value, key) => {
    themes[key] = createTheme(merge({}, themeOptions, value));
  });
  return themes;
}
const themes = createBlogThemes();

export const BlogLayoutSettings = {
  activeLayout: "layout1", // layout1, layout2
  activeTheme: "purple1", // View all valid theme colors inside BlogTheme/themeColors.js
  perfectScrollbar: true,

  themes: themes,
  layout1Settings, // open Layout1/Layout1Settings.js

  secondarySidebar: {
    show: false,
    open: true,
    theme: "slateDark1" // View all valid theme colors inside BlogTheme/themeColors.js
  },
  // Footer options
  footer: {
    show: false,
    fixed: false,
    theme: "slateDark1" // View all valid theme colors inside BlogTheme/themeColors.js
  }
};
