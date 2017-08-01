import { hashHistory } from 'react-router';
import { dispatch, subscribe } from './EventEmitter';
import { request } from './Request';
import { getProfile } from '../../actions/User';
import { selfAssignmentCompletion } from '../../core/helpers/Utils';

export default new class {

  constructor() {
    // Listen for every request status error
    subscribe('request:result', (r) => {
      if (r.status === this.logoutErrorCode || r.readyState === 0) {
        this.logout();
      }

    });
  }

  get logoutErrorCode() {
    return 401;
  }

  get loginRoute() {
    return '/login';
  }

  get registerRoute() {
    return '/register';
  }

  get passwordRecoveryRoute() {
    return '/recovery-password';
  }

  get loginSuccessRoute() {
    return '/#/dashboard';
  }

  get authorizedCookies() {
    return 'loggedIn=true';
  }

  get unauthorizedCookies() {
    return 'loggedIn=false';
  }

  login(defaultRoute = this.loginSuccessRoute) {
    // Get loggined user info
    getProfile(
      (r) => {
        // Set authorization cookies
        document.cookie = this.authorizedCookies;

        // Save loggined user data
        localStorage.setItem('loggedUser', JSON.stringify(r));

        // Check if self-assignment fully filled
        selfAssignmentCompletion(
          // Fully completed self assignment
          () => location.href = config.FRONT_URL.concat(defaultRoute),

          // Self assignment not completed yet
          () => location.href = '/#/start'
        );
      },
      (e) => console.error('Error:', e)
    );
  }

  logout() {
    request('/logout', null, 'get')
    .always(() => {
      // Set unauthorization cookies
      document.cookie = this.unauthorizedCookies;

      // Redirect to login route
      hashHistory.push(this.loginRoute);
    });
  }

  routeEnter(prevState, replace) {
    this.checkLoggedIn(prevState, replace);
  }

  routeChange(prevState, nextState, replace) {
    this.checkLoggedIn(nextState, replace);
  }

  // Check if route does not need authentification
  isWildcardRoute(route) {
    return [this.loginRoute, this.registerRoute].indexOf(route) !== -1 ||
           !!route.match(new RegExp(this.passwordRecoveryRoute));
  }

  checkLoggedIn(prevState, replace) {
    const cookiesSet = document.cookie.match(this.authorizedCookies);
    const requestRoute = prevState.location.pathname;

    if (!cookiesSet && !this.isWildcardRoute(requestRoute)) {
      replace(this.loginRoute);
    }
    if (cookiesSet && this.isWildcardRoute(requestRoute)) {
      replace('/');
    }
  }
};
