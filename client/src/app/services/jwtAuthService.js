import moment from "moment";
import { auth, api } from "./backendService";
import localStorageService from "./localStorageService";

const logInSuccess = function(res) {

  if (!res.success) {
    return res;
  }

  // Login successful
  // Save token
  this.setSession({ token: res.data.token, expiresIn: res.data.expiresIn });
  // Set user
  this.setUser(res.data.user);

  return res;
}

class JwtAuthService {

  // You need to send http request with email and passsword to our server in this method
  // our server will return user object & a Token
  // User should have role property
  // You can define roles in app/auth/authRoles.js
  loginWithEmailAndPassword = (email, password) => {
    return auth.post('login', { email, password }).then(logInSuccess.bind(this));
  };

  registerUser = ({ username, email, password, captcha }) => {
    return auth.post('signup', { username, email, password, captcha }).then(logInSuccess.bind(this));
  }

  // You need to send http requst with existing token to our server to check token is valid
  // This method is being used when user logged in & app is reloaded
  getUserSession = () => {

    // if (this.isLoggedOut()) {
    //   return null;
    // }

    // Token is valid
    return api.get('session').then(({ success, data } = {}) => {

      if (!success || !data) {
        return null;
      }

      this.setUser(data);

      return data;
    });
  };

  // Check Whether User is login or not
  isLoggedIn() {
    return (!!localStorageService.getToken() && moment().isBefore(localStorageService.getExpiration()));
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  logout = () => {
    auth.get('logout').then((response) => {
      this.setSession();
      this.removeUser();
    })
  }

  // Set token to all http request header, so you don't need to attach everytime
  setSession = ({ token, expiresIn } = {}) => {
    if (token) {
      localStorageService.setToken({ token, expiresIn });
    } else {
      localStorageService.removeToken();
    }
  };

  // Save user to localstorage
  setUser = (user) => {    
    localStorageService.setUser(user);
  }

  // Remove user from localstorage
  removeUser = () => {
    localStorageService.removeUser();
  }
}

export default new JwtAuthService();
