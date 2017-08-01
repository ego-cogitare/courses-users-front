import React from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { actualForUser, latestGoals } from '../../../../actions/Appointments';

export default class Actual extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      events: [],
      latestGoals: [],
      courseId: props.courseId
    };
  }

  componentWillMount() {
    actualForUser({ courseId: this.state.courseId },
      (events) => this.setState({ events }),
      (e) => console.error(e)
    );

    // Get latest goals
    latestGoals(
      (r) => this.setState({ latestGoals: (r || []).slice(0, 3) }),
      (e) => console.error(e)
    );
  }

  render() {
    return (
      <div>
        <div class="title border-color1 text-bold">
            Aktuelle Termine:
        </div>
        <ul class="list">
          {
            this.state.events.map((e) => (
              <li key={ e.id }>
                <div class="title text-bold">
                  Nächster Termin Micro-Coaching:
                </div>
                <div class="descr">
                  { moment.unix(e.forDate / 1000).format('DD.MM.YYYY H:mm') }-{ moment.unix(e.forDate / 1000 + 2700).format('H:mm') }
                  {/*<span class="icon calendar"></span> */} &nbsp;
                  <a className="skype" href="skype:Enjoycls"><i class="fa fa-skype" aria-hidden="true"></i> Enjoycls</a>
                </div>
              </li>
            ))
          }
          { /* Latest user goals */
            this.state.latestGoals.map(({ id, text, title, forDate }) => (
              <li key={id}>
                <div class="title text-bold">
                  Nächstes Ziel: {title}
                </div>
                <div class="descr">
                  {moment.unix(forDate / 1000).format('DD.MM.YYYY')} {text}
                </div>
              </li>
            ))
          }
        </ul>
        <div>
          <Link className="btn color1 border-color1" style={{ marginTop: '15px' }} to="/appointments">Bearbeiten</Link>
        </div>
        <div>
          <Link class="btn color1 border-color1" style={{ marginTop: '15px' }} to="/calendar">Lernkalender</Link>
        </div>
      </div>
    );
  }
}
