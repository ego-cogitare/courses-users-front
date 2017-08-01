import React from 'react';
import CustomScroll from 'react-custom-scroll';
import { Link } from 'react-router';
import { fetch } from '../../../../actions/Calendar';
import { getStoredData } from '../../../../actions/User';

export default class Goals extends React.Component {

  constructor(props) {
    super(props);

    this.state = { goals: [] };

    getStoredData({ key: 'goals' },
      (r) => { this.setState({ goals: JSON.parse(r.json) });},
      (e) => console.log(e)
    );
  }

  render() {
    let goalNumber = 0;

    return (
      <div>
        <div class="title border-color5 text-bold">
          Deine Lernziele:
        </div>
        <ul class="list">
        {
          this.state.goals.map((goal, key) => {
            return goal.trim() ?
              <li key={key}>
                <div class="title text-bold">
                  <span class="color5">Ziel #{++goalNumber}:</span> <span>{goal}</span>
                </div>
              </li> : null
          })
        }
        </ul>
        <Link class="btn color5 border-color5" style={{ marginTop: '25px' }} to="/self-assignment/step-8/dashboard">Bearbeiten</Link>
      </div>
    );
  }
}
