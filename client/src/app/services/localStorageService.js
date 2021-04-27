import moment from "moment";

class localStorageService {
  ls = window.localStorage

  tokenName = 'auth_token';
  tokenExpiresName = this.tokenName + '_expiresIn';
  userName = 'auth_user';

  setItem(key, value) {
    value = JSON.stringify(value)
    this.ls.setItem(key, value)
    return true
  }

  getItem(key) {
    let value = this.ls.getItem(key);
    try {
      return JSON.parse(value)
    } catch (e) {
      return null
    }
  }

  removeItem(value) {
    this.ls.removeItem(value);
    return true;
  }

  setToken(value) {

    this.setItem(this.tokenName, value.token);

    if (value.expiresIn) {
      let expiresIn = value.expiresIn;
      let number = expiresIn.replace(/[^\d+]/, '');
      let type = expiresIn.replace(/(\d+)/, '');
      expiresIn = moment().add(number, type);
      this.setItem(this.tokenExpiresName, JSON.stringify(expiresIn.valueOf()));
    }
  }

  getToken() {
    return this.getItem(this.tokenName);
  }

  removeToken() {
    this.removeItem(this.tokenName);
    this.removeItem(this.tokenExpiresName);
  }

  getExpiration() {
    const expiration = this.getItem(this.tokenExpiresName);
    if (!expiration) {
      return moment().add('1', 'd').valueOf();
    }
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt).valueOf();
  }

  setUser(user) {
    return this.setItem(this.userName, user);
  }

  getUser() {
    return this.getItem(this.userName);
  }

  removeUser() {
    return this.removeItem(this.userName);
  }

}

export default new localStorageService();