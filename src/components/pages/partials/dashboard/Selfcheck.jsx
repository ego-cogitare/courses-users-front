import React from 'react';
import { allSelfCheck } from '../../../../actions/Lection';
import User from '../../../../core/helpers/User';

export default class Selfcheck extends React.Component {

  constructor(props) {
    super(props);
    this.state = { teamrollenAvailable : false, courseId: props.courseId }
  }

  componentDidMount() {
      allSelfCheck({
          courseId: this.state.courseId
      }, (r) => {
        let dataCount = Object.getOwnPropertyNames(r.data).length;
        if (dataCount > 0  && dataCount === r.steps.length) {
          this.setState({
              teamrollenAvailable: true
          });
        }

      });
  }

  render() {

    let teamtollen = <li>
      <a target="_blank" href={ config.BACK_URL + `/pdf?filename=Teamrollen_${User.data.lastName}.pdf&hash[]=/sa-printable/${localStorage.getItem('currentCourseId')}`} class="title text-bold">
        Teamrollen
        <span class="icon pdf"></span>
      </a>
    </li>;

    return (
      <div>
        <div class="title border-color2 text-bold">
          Ergebnisse Deiner Selbst-Checks:
        </div>
        <ul class="list">
          <li>
            <a target="_blank" href={ config.BACK_URL + `/pdf?hash[]=/self-assignment/step-7&filename=Reflexionsfragen_${User.data.lastName}.pdf`} class="title text-bold">
              Reflexionsfragen
              <span class="icon pdf"></span>
            </a>
          </li>
          <li>
            <a target="_blank" href={ config.BACK_URL + `/pdf?filename=PersonalityCheck_${User.data.lastName}.pdf&hash[]=/self-assignment/step-2&hash[]=/self-assignment/step-3&hash[]=/self-assignment/step-4`} class="title text-bold">
              Personality Check
              <span class="icon pdf"></span>
            </a>
          </li>
          <li>
            <a target="_blank" href={ config.BACK_URL + `/pdf?filename=Herausforderungen_${User.data.lastName}.pdf&hash[]=/self-assignment/step-6`}  class="title text-bold">
              Herausforderungen
              <span class="icon pdf"></span>
            </a>
          </li>
            { this.state.teamrollenAvailable && teamtollen }

        </ul>
      </div>
    );
  }
}
