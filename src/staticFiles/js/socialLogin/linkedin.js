export default class LinkedIn {
  constructor() {
    // Load linedin javascript sdk
    IN.init({ api_key : config.LINKEDIN_API_KEY });
  }

  login(onSuccess, onFail) {
    if (typeof IN === 'undefined' || typeof IN.User === 'undefined') {
      console.error('LinkedIn sdk not loaded yet, please wait a moment.');
      return false;
    }

    // On user authorized
    IN.User.authorize(() => {
      // Request user data
      IN.API.Raw("/people/~:(id,firstName,lastName,emailAddress)?format=json")
        .result(onSuccess)
        .error(onFail);
    });
  }
}
