import React from 'react';
import { hashHistory } from 'react-router';
import { getProfile } from '../../actions/User';
import Footer from './partials/Footer.jsx';
import { getLink, resetPassword } from '../../actions/PasswordRecovery';

export default class RecoveryPassword extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: {
        className: '',
        text: ''
      },
      view: 'email'
    };
  }

  /**
   * Send password recovery link to email address
   */
  handleSubmitEmail(e) {
    e.stopPropagation();
    e.preventDefault();

    const email = e.target.email.value;

    getLink({ email },
      (r) => {
        this.setState({
          message: {
            className: 'success',
            text: `Varification email sent to ${email}`
          }
        });
      },
      (e) => {
        this.setState({
          message: {
            className: 'error',
            text: e.responseJSON.text
          }
        });
      }
    );
  }

  /**
   * Update user password
   */
  handleSubmitPassword(e) {
    e.stopPropagation();
    e.preventDefault();

    // Check if both password are equals
    const passwords = [
      e.target.password1.value,
      e.target.password2.value
    ];

    if (passwords[0] !== passwords[1]) {
      this.setState({ message: { className: 'error', text: 'Passwords are different' } });
      return ;
    }

    if (passwords[0].length < 6) {
      this.setState({ message: { className: 'error', text: 'Password too short (at least 6 characters required)' } });
      return ;
    }

    // Reset errors
    this.setState({ message: { className: '', text: '' } });

    // Update user password
    resetPassword({ password: passwords[0], linkId: this.props.params.id },
      (r) => {
        this.setState({
          message: {
            //className: 'success',
            // text: 'Password updated. You can login now.'
          }
        });

        getProfile((r) => {
          document.cookie = 'loggedIn=true';
          localStorage.setItem('loggedUser', JSON.stringify(r));
          location.hash="#/";
        });

      },
      (e) => {
        this.setState({
          message: {
            className: 'error',
            text: e.responseJSON.text
          }
        });
      }
    );
  }

  /**
   * Detect active view depends of url parametres
   */
  detectActiveView(props = this.props) {
    this.setState({
      view: props.params.id ? 'password' : 'email',
      message: { className: '', text: '' }
    });
  }

  componentWillReceiveProps(props) {
    this.detectActiveView(props);
  }

  componentWillMount() {
    this.detectActiveView();
  }

  render() {
    return (
      <div class="wrapper login h100p">
        <div class="content">
          <div class="clear columns">
          {
            this.state.view === 'email' &&
            <div class="column left">
              <h2 class="title color-1">
                Password recovery
              </h2>
              <p>
                Type your email address in the field below.
              </p>
              <form class="user-login" action="/" method="post" onSubmit={this.handleSubmitEmail.bind(this)}>
                { this.state.message.text && <p class={this.state.message.className}>{this.state.message.text}</p> }
                <input type="email" name="email" placeholder="E-Mail..." class="input" required autoFocus autoComplete="off" />
                <button type="submit" name="submit" class="btn submit">ABSENDEN</button>
              </form>
            </div>
          }
          {
            this.state.view === 'password' &&
            <div class="column left">
              <h2 class="title color-1">
                Password recovery
              </h2>
              <p>
                Type your password in the field below
              </p>
              <form class="user-login" action="/" method="post" onSubmit={this.handleSubmitPassword.bind(this)}>
                { this.state.message.text && <p class={this.state.message.className}>{this.state.message.text}</p> }
                <input type="password" name="password1" placeholder="New password..." class="input" required autoFocus autoComplete="off" />
                <input type="password" name="password2" placeholder="Repeat password..." class="input" required autoComplete="off" />
                <button type="submit" name="submit" class="btn submit">Update Password</button>
              </form>
            </div>
          }
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
