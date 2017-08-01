import React from 'react';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';
import moment from 'moment';
import Auth from '../../core/helpers/Auth';
import { loginDefault, loginSocial } from '../../actions/Login';
import SocialLogin from '../../staticFiles/js/socialLogin';
import Footer from './partials/Footer.jsx';
import '../../staticFiles/css/login.css';

const ERROR_USER_NOT_FOUD = 'E-Mail Adresse und/oder Passwort nicht korrekt.';

export default class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = { error: '' };
  }

  setError(error) {
    this.setState({ error });
  }

  clearError() {
    this.setState({ error: '' });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.clearError();

    loginDefault(
      {
        username: e.target.username.value,
        password: e.target.password.value
      },
      () => Auth.login(),
      (error) => {
        this.setError(ERROR_USER_NOT_FOUD);
        console.error(error);
      }
    );
  }

  loginViaFacebook(e) {
    e.preventDefault();
    this.clearError();

    SocialLogin.facebook.login(
      (response) => {
        // Login into portal with facebook credentials
        loginSocial(
          {
            externalId : response.id,
            email      : response.email,
            firstName  : response.first_name,
            lastName   : response.last_name,
            network    : 'FACEBOOK'
          },
          () => Auth.login(),
          (error) => {
            console.error(error);
            this.setError(ERROR_USER_NOT_FOUD);
          }
        );
      },
      (error) => {
        console.error(error);
        this.setError("Facebook connection error. Please, try again.");
      }
    );
  }

  loginViaGooglePlus(e) {
    e.preventDefault();
    this.clearError();

    SocialLogin.googlePlus.login(
      (response) => {
        loginSocial(
          {
            externalId : response.result.names[0].metadata.source.id,
            email      : response.result.emailAddresses[0].value,
            firstName  : response.result.names[0].familyName,
            lastName   : response.result.names[0].givenName,
            network    : 'GOOGLE_PLUS'
          },
          () => Auth.login(),
          (error) => {
            this.setError(ERROR_USER_NOT_FOUD);
          }
        );
      },
      (error) => {
        console.error('Login fail:', error);
        this.setError("Google connection failed");
      }
    );
  }

  loginViaTwitter(e) {
    e.preventDefault();
    this.clearError();
    const self = this;

    SocialLogin.twitter.login(
      function() {
        this.close();
        Auth.login(self.onLoginRedirect);
      },
      function() {
        self.setError(ERROR_USER_NOT_FOUD);
        this.close();
      }
    );
  }

  loginViaLinkedIn(e) {
    e.preventDefault();
    this.clearError();

    SocialLogin.linkedIn.login(
      (response) => {
        loginSocial(
          {
            externalId : response.id,
            email      : response.emailAddress,
            firstName  : response.firstName,
            lastName   : response.lastName,
            network    : 'LINKEDIN'
          },
          () => Auth.login(),
          (error) => {
            console.error('Login error.', error);
            this.setError(ERROR_USER_NOT_FOUD);
          }
        );
      },
      (error) => {
        console.error('Login fail:', error);
        this.setError("LinkedIn connection error");
      }
    );
  }

  render() {
    return (
      <div class="wrapper login h100p">
        <div class="content">
          <div class="clear columns">
            <div class="column left">
              <h2 class="title color-1">
                Konto-Anmeldung
              </h2>
              <p>
                Melde Dich jetzt mit Deinen Creative learning space Zugangsdaten in Deinem Konto an.
              </p>
              <form class="user-login" action="#" onSubmit={this.handleSubmit.bind(this)}>
                  { this.state.error &&
                  <p className="error">
                      {this.state.error}
                  </p>
                  }
                <input type="email" name="username" placeholder="E-Mail..." class="input" required autoFocus autoComplete="off" />
                <input type="password" name="password" placeholder="Passwort..." class="input" required autoComplete="off" />
                <button type="submit" name="submit" class="btn submit">Jetzt anmelden</button>
              </form>
              <Link className="forgot-password" to="/recovery-password">Passwort vergessen?</Link>
            </div>
            <div class="column left text-center oder">
              Oder
            </div>
            <div class="column left">
              <h2 class="title color-2">
                Anmeldung über Social-Login
              </h2>
              <p>
                Melde Dich alternativ bei Creative learning space bequem und sicher über einen bekannten Social-Login Anbieter an.
              </p>
              <ul class="social-links">
                <li class="social-link">
                  <a href="#" class="btn facebook" onClick={this.loginViaFacebook.bind(this)}>Mit <span class="color-fff">facebook</span> anmelden</a>
                </li>
                <li class="social-link">
                  <a href="#" class="btn twitter" onClick={this.loginViaTwitter.bind(this)}>Mit <span class="color-fff">twitter</span> anmelden</a>
                </li>
                <li class="social-link">
                  <a href="#" class="btn google-plus" onClick={this.loginViaGooglePlus.bind(this)}>Mit <span class="color-fff">google</span> anmelden</a>
                </li>
                <li class="social-link">
                  <a href="#" class="btn linkedin" onClick={this.loginViaLinkedIn.bind(this)}>Mit <span class="color-fff">linkedin</span> anmelden</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
