export default class Facebook {
  constructor() {
    window.fbAsyncInit = function() {
      FB.init({
        appId   : config.FACEBOOK_APP_ID,
        cookie  : true,
        xfbml   : true,
        version : 'v2.8'
      });
      FB.AppEvents.logPageView();
    };
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  login(success, fail) {
    FB.login(function(response) {
      if (response.authResponse) {
         FB.api('/me', { locale: 'en_US', fields: 'first_name, last_name, email' }, success);
      } else {
        fail();
      }
    }, {scope: 'email'});
  }
}
