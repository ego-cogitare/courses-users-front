import React from 'react';
import { Link } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { selfAssignmentCompletion } from '../../core/helpers/Utils';
import '../../staticFiles/css/start.css';
import Video from './partials/widgets/types/Video.jsx';

export default class Start extends React.Component {

  constructor() {
    super();

    this.state = {
      class3Step: '',
      dataChecked: false
    };
  }

  componentWillMount() {
    // Check if self-assignment fully filled
    selfAssignmentCompletion(
      // Fully completed self assignment redirect to dashboard
      () => location.hash = "#",

      // Self assignment not completed yet (do nothing)
      () => this.setState({ dataChecked: true })
    );
    // this.setState({ dataChecked: true });
  }

  finish(e) {
    this.setState({ class3Step: 'disabled' });
  }

  render() {
    return (
      this.state.dataChecked ?
      <div class="wrapper start h100p">
        <div class="content">
          <div className="start-header">
            <Link to="/logout">
              <img className="logout-btn" src={require("../../staticFiles/img/icon_logout.png")} />
            </Link>
          </div>
          <div className="clear"></div>
          <div class="clear">
            <div class="column left w50p">
              <h2 class="title color-1">
                Tutorial Video
              </h2>
              <p>
                Unser Einführungsvideo führt Dich durch die Systematik und Funktionalitäten
                von <a href="http://www.enjoycls.com" style={{ color: '#be99ff' }} target="_blank">www.enjoycls.com</a>. Du erhältst
                wichtige Informationen für einen reibungslosen Lernprozess.
              </p>
              <div class="tutorial-video">
                <Video poster={require('../../staticFiles/video/poster-01.png')} step={ {body: 'http://api.enjoycls.com/files/Einfuhrungsvideo.mp4' } } />
                {/*<video poster={require('../../staticFiles/video/poster-01.png')} controls crossorigin>
                  <source src="http://api.enjoycls.com/file/content?path=/&name=Einführungsvideo.mp4" type="video/mp4" />
                </video>*/}
              </div>
            </div>
            <div class="column left w50p">
              <h2 class="title color-2">
                Deine ersten Schritte
              </h2>
              <ul class="menu">
                <li class="disabled">
                  Profil anlegen
                </li>
                <li>
                  Selbst-Reflexion starten
                </li>
                <li>
                  Termin für Micro-Coaching
                </li>
                <li>
                  Lernprogramm starten
                </li>
              </ul>
            </div>
          </div>
          <div class="help clear">
            <div class="w50p left text-right">
              <span class="item">Fragen? <br/>Lass uns skypen!</span>
            </div>
            <div class="w50p right text-left clear">
              <a href="skype:enjoycls?call" class="item text-center">Kontakt</a>
              <Link to={`/self-assignment/step-1`} className="item text-center right" style={{ marginRight: 35 }}>Weiter</Link><br/>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      :
      null
    );
  }
}
