import "styles/app.scss";
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import BlogTheme from "./BlogLayout/BlogTheme/BlogTheme";
import AppContext from "./appContext";
import history from "history.js";

import routes from "./RootRoutes";
import { Store } from "./redux/Store";
import Auth from "./auth/Auth";
import BlogLayout from "./BlogLayout/BlogLayoutSFC";
import AuthGuard from "./auth/AuthGuard";

const App = () => {
  return (
    <AppContext.Provider value={{ routes }}>
      <Provider store={Store}>
        <BlogTheme>
          <Auth>
            <Router history={history}>
              <AuthGuard>
                <BlogLayout />
              </AuthGuard>
            </Router>
          </Auth>
        </BlogTheme>
      </Provider>
    </AppContext.Provider>
  );
};

export default App;
