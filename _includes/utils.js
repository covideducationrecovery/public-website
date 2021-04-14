class JwtManager {
  static get _key() {
    return 'bearer-token'
  }
  static set(jwt, storage) {
    try {
      const jwtArray = jwt.split('.');
      const jwtHeader = JSON.parse(atob(jwtArray[0]));
      const jwtPayload = JSON.parse(atob(jwtArray[1]));
      storage.setItem(JwtManager._key, JSON.stringify({
        token: jwt,
        header: jwtHeader,
        payload: jwtPayload
      }));
      return true
    } catch {
      return false
    }
  }
  static get item() {
    const result = window.sessionStorage.getItem(JwtManager._key);
    if (result) {
      return JSON.parse(result)
    }
    return JSON.parse(window.localStorage.getItem(JwtManager._key));
  }
  static remove() {
    window.sessionStorage.removeItem(JwtManager._key);
    window.localStorage.removeItem(JwtManager._key);
  }
  static get token() {
    if (JwtManager.item) {
      return JwtManager.item.token;
    }
  }
  static get header() {
    if (JwtManager.item) {
      return JwtManager.item.header;
    }
  }
  static get payload() {
    if (JwtManager.item) {
      return JwtManager.item.payload;
    }
  }
}