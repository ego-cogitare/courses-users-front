export default class Twitter {
  constructor() {
   document.domain = config.SITE_DOMAIN;
  }

  popup(url) {
    return window.open(config.BACK_URL + url, '_blank', 'width=800, height=635');
  }

  bindCallbacks(success, fail, context) {
    // Bind popup window context to callback function
    window.twitterLoginSuccess = success.bind(context);
    window.twitterLoginFailed = fail.bind(context);
  }

  login(success, fail) {
    this.bindCallbacks(success, fail, this.popup('/twitter/auth'));
  }

  register(success, fail) {
    this.bindCallbacks(success, fail, this.popup('/twitter/registration'));
  }
}
