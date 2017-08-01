import React from 'react';
import { registerDefault, registerSocial } from '../../actions/Register';
import { getProfile } from '../../actions/User';
import SocialLogin from '../../staticFiles/js/socialLogin';
import Footer from './partials/Footer.jsx';
import '../../staticFiles/css/register.css';
import ProfileImageLoader from '../../core/ui/ProfileImageLoader.jsx';
import Auth from '../../core/helpers/Auth';

export default class Register extends React.Component {

  constructor() {
    super();

    // Default route to redirect to after success registration
    this.defaultRoute = '/#/start';

    this.state = { error: '' };
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ error: '' });

    const formFields = [
      'firstName', 'lastName', 'email', 'password'
    ];

    const registrationData = {
      role: 'ROLE_USER'
    };

    // Pack form fields
    formFields.forEach((field) => {
      registrationData[field] = this.refs[field].value;
    });
    registrationData.avatar = this.state.avatar;

    registerDefault(
      registrationData,
      (success) => {
        // Reset form fields
        formFields.forEach((field) =>  this.refs[field].value = '');

        // Authorize and redirect to start page
        Auth.login(this.defaultRoute);
      },
      (error) => {
        if (error.responseJSON.message === 'Email already exists') { location.hash = '#/login'; return; }
        // Lightup errored fields
        this.setState({ error: error.responseJSON.message });
        console.error(error);
      }
    );
  }

  registerViaFacebook(e) {
    e.preventDefault();
    this.setState({ error: '' });

    /**
     * Login into facebook and get user information
     */
    SocialLogin.facebook.login(
      (response) => {
        console.info('Login success:', response);

        // Registration in portal with facebook credentials
        registerSocial(
          {
            externalId : response.id,
            email      : response.email,
            firstName  : response.first_name,
            lastName   : response.last_name,
            network    : 'FACEBOOK'
          },
          (success) => {
            // Authorize and redirect to start page
            Auth.login(this.defaultRoute);

            console.log('Register via facebook success: ', success);
          },
          (error) => {
            if (error.responseJSON.message === 'Email already exists') { location.hash = '#/login'; return; }
            this.setState({ error: error.responseJSON.message });
            console.error('Registration error:', error);
          }
        );
      },
      (error) => {
        console.error('Login fail:', error);
      }
    );
  }

  registerViaTwitter(e) {
    e.preventDefault();
    this.setState({ error: '' });

    const self = this;

    SocialLogin.twitter.register(
      function() {
        this.close();

        // Authorize and redirect to start page
        Auth.login(this.defaultRoute);
      },
      function() {
        this.close();
        self.setState({ error: 'Registration error' });
      }
    );
  }

  registerViaGooglePlus(e) {
    e.preventDefault();
    this.setState({ error: '' });

    SocialLogin.googlePlus.login(
      (response) => {
        // Registration in portal with googleplus credentials
        registerSocial(
          {
            externalId : response.result.names[0].metadata.source.id,
            email      : response.result.emailAddresses[0].value,
            firstName  : response.result.names[0].familyName,
            lastName   : response.result.names[0].givenName,
            network    : 'GOOGLE_PLUS'
          },
          (success) => {
            // Authorize and redirect to start page
            Auth.login(this.defaultRoute);

            console.log('Register via googleplus success: ', success);
          },
          (error) => {
            if (error.responseJSON.message === 'Email already exists') { location.hash = '#/login'; return; }
            this.setState({ error: error.responseJSON.message });
            console.error('Registration error:', error);
          }
        );
      },
      (error) => {
        console.error('Login fail:', error);
      }
    );
  }

  registerViaLinkedIn(e) {
    e.preventDefault();
    this.setState({ error: '' });

    SocialLogin.linkedIn.login(
      (response) => {
        // Registration in portal with linkedin credentials
        registerSocial(
          {
            externalId : response.id,
            email      : response.emailAddress,
            firstName  : response.firstName,
            lastName   : response.lastName,
            network    : 'LINKEDIN'
          },
          (success) => {
            // Authorize and redirect to start page
            Auth.login(this.defaultRoute);

            console.log('Register via linkedin success: ', success);
          },
          (error) => {
            if (error.responseJSON.message === 'Email already exists') { location.hash = '#/login'; return; }
            this.setState({ error: error.responseJSON.message });
            console.error('Registration error:', error);
          }
        );
      },
      (error) => {
        console.error('Login fail:', error);
      }
    );
  }

  updateAvatar({ name: avatar }) {
    this.setState({ avatar });
  }

  render() {
    return (
      <div class="wrapper register h100p">
        <div class="content">
          <div class="clear columns">
            <div class="column left">
              <div class="clear">
                <div class="left" style={{ width: '315px' }}>
                  <h2 class="title color-1">
                    Dein Profil anlegen
                  </h2>
                  <p>
                    Registriere Dich bei Creative learning space über folgendes Formular:
                  </p>
                </div>
                <ProfileImageLoader avatar={this.state.name} uploadSuccess={this.updateAvatar.bind(this)}/>
              </div>
              <form class="user-register" action="#" autoComplete="off" onSubmit={this.handleSubmit.bind(this)}>
                { this.state.error &&
                <p className="error">
                  {this.state.error}
                </p>
                }
                <input type="text" ref="firstName" placeholder="Vorname..." class="input" required autoFocus />
                <input type="text" ref="lastName" placeholder="Nachname..." class="input" required />
                <input type="email" ref="email" placeholder="E-Mail Adresse..." class="input" required autoComplete="off" />
                <input type="password" ref="password" placeholder="Passwort..." class="input" required autoComplete="off" />
                <button type="submit" class="btn submit">Jetzt Registrieren</button>
              </form>
            </div>
            <div class="column left text-center oder">
              Oder
            </div>
            <div class="column left">
              <h2 class="title color-2">
                Registrierung Social-Login
              </h2>
              <p>
                Registriere Dich bei Creative learning space bequem und sicher über einen bekannten Social-Login Anbieter:
              </p>
              <ul class="social-links">
                <li class="social-link">
                  <a href="#" class="btn facebook" onClick={this.registerViaFacebook.bind(this)}>Mit <span class="color-fff">facebook</span> registrieren</a>
                </li>
                <li class="social-link">
                  <a href="#" class="btn twitter" onClick={this.registerViaTwitter.bind(this)}>Mit <span class="color-fff">twitter</span> registrieren</a>
                </li>
                <li class="social-link">
                  <a href="#" class="btn google-plus" onClick={this.registerViaGooglePlus.bind(this)}>Mit <span class="color-fff">google</span> registrieren</a>
                </li>
                <li class="social-link">
                  <a href="#" class="btn linkedin" onClick={this.registerViaLinkedIn.bind(this)}>Mit <span class="color-fff">linkedin</span> registrieren</a>
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
