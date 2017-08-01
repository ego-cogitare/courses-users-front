import React from 'react';
import Rodal from 'rodal';
import User from '../../core/helpers/User';
import Footer from './partials/Footer.jsx';
import Header from './partials/Header.jsx';
import ProfileImageLoader from '../../core/ui/ProfileImageLoader.jsx';
import { updateProfile, updatePassword } from '../../actions/User';
import '../../staticFiles/css/profile.css';

export default class Profile extends React.Component {

    constructor() {
      super();

      this.state = User.data;
      this.state.isDialogVisible = false;
    }

    componentDidMount() {
      this.refs.firstName.value = User.data.firstName;
      this.refs.lastName.value = User.data.lastName;
      this.refs.email.value = User.data.email;

      // Scroll to the top of the page
      window.scrollTo(0, 0);
    }

    printError(error) {
      this.setState({ error });
    }

    clearError(errorStr) {
      this.setState({ error: "" });
    }

    redirectToLogin() {
      location.hash = "/login";
    }

    handleSubmit(e) {
      e.preventDefault();
      this.clearError();

      const formFields = [
        'firstName', 'lastName'
      ];

      // Pack form fields
      formFields.forEach((field) => {
        this.state[field] = this.refs[field].value;
      });

      updateProfile(
        this.state,
        (r) => {
          this.setState({ isDialogVisible: true });
          User.data = r;
          this.checkNewPassword();
        },
        (error) => {
          this.printError(error.responseJSON.message);
          console.log(error);
        }
      );
    }

    checkNewPassword() {
      if (!this.refs.newPassword || !this.refs.newPassword.value) {
        return ;
      }

      let data = {
        currentPassword: this.refs.currentPassword.value,
        newPassword: this.refs.newPassword.value,
      };

      if (data.newPassword != this.refs.newPassword2.value || data.newPassword.length == 0) {
        this.printError("Passwords invalid");
        return ;
      }

      updatePassword(data,
        (r) => this.clearPasswordFields(),
        (e) => this.printError(error.responseJSON.message)
      );
    }

    clearPasswordFields() {
      this.refs.currentPassword.value = '';
      this.refs.newPassword.value = '';
      this.refs.newPassword2.value = '';
    }

    updateAvatar(imgData) {
      this.setState({ avatar: imgData.name });

      updateProfile(
        this.state,
        (r) => User.data = r,
        (e) => console.error(e)
      )
    }

    renderNotificationDialog() {
      return (
        <Rodal
          visible={this.state.isDialogVisible}
          height={95}
          showCloseButton={false}
          animation='fade'
          onClose={() => {}}
          >
          <div class="modal-body">
            Wir haben Deine Änderungen übernommen.
          </div>
          <div class="modal-footer" style={{ padding: '10px 6px 0', textAlign: 'center' }}>
            <button type="button" class="btn btn-default" onClick={() => this.setState({ isDialogVisible: false })}>Ok</button>
          </div>
        </Rodal>
      );
    }

    render() {
      return (
        <div className="wrapper profile">
          <Header />
          <div className="content">
            <div className="clear columns">
                <div className="column left">
                  <div className="clear">
                    <div className="left" style={{width: '315px'}}>
                      <h2 className="title color-1">
                        Profil
                      </h2>
                      <p>
                        Ändere Deine Profilinformationen durch das folgende Formular:
                      </p>
                    </div>
                    <ProfileImageLoader uploadSuccess={this.updateAvatar.bind(this)} avatar={this.state.avatar} />
                  </div>
                  <form className="user-register" action="#" autoComplete="off" onSubmit={this.handleSubmit.bind(this)}>
                    { this.state.error && <p className="error">{this.state.error}</p> }
                    <input
                      type="text"
                      ref="firstName"
                      placeholder="Vorname..."
                      className="input"
                      required
                    />
                    <input
                      type="text"
                      ref="lastName"
                      placeholder="Nachname..."
                      className="input"
                      required
                    />
                    <input
                      type="email"
                      ref="email"
                      placeholder="E-Mail-Adresse..."
                      className="input"
                      autoComplete="off"
                      required
                      disabled
                    />
                    { User.isSocial && <p className="notice">Passwortänderung ist nicht möglich, weil Sie mit dem sozialen Netzwerk registriert wurden.</p> }
                    {
                      User.isSocial &&
                      <div>
                        <h2 className="title color-1">Passwort</h2>
                        <input
                          type="password"
                          ref="currentPassword"
                          placeholder="Ihr Aktuelles Passwort..."
                          className="input"
                          autoComplete="off"
                        />
                        <input
                          type="password"
                          ref="newPassword"
                          placeholder="Neues Passwort..."
                          className="input"
                          autoComplete="off"
                        />
                        <input
                          type="password"
                          ref="newPassword2"
                          placeholder="Bestätigen eines neuen Passwort..."
                          className="input"
                          autoComplete="off"
                        />
                      </div>
                    }
                    <button type="submit" className="text-bold btn">Speichern</button>
                  </form>
                </div>
            </div>
          </div>
          { this.renderNotificationDialog() }
          <Footer />
        </div>
      );
    }
}
