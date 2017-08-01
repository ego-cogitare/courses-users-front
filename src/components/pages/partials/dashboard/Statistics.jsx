import React from 'react';
import CustomScroll from 'react-custom-scroll';
import { Link } from 'react-router';
import { get } from '../../../../actions/Statistics';

export default class Statistics extends React.Component {


  constructor() {
    super();

    this.state = { statistics: {} };
  }

  componentWillMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (this.props.courseId != prevProps.courseId) {
      this.update();
    }
  }

  update() {
    get({ courseId: this.props.courseId },
      (statistics) => this.setState({ statistics }),
      (e) => console.error(e)
    );
  }

  totalScore() {
    return Number(this.state.statistics.communityPoints)
         + Number(this.state.statistics.quizPoints)
         + Number(this.state.statistics.microblogPoints);
  }

  totalScoreIcon() {
    if (Object.keys(this.state.statistics).length === 0) {
      return '';
    }
    if (this.totalScore() >= 280) {
      return <img src={ require('../../../../staticFiles/img/dashboard/250-300.png') } width="100" alt={ this.totalScore() } />;
    }
    if (this.totalScore() >= 260) {
      return <img src={ require('../../../../staticFiles/img/dashboard/250-300.png') } width="75" style={{ marginTop: '15px' }} alt={ this.totalScore() } />;
    }
    if (this.totalScore() >= 245) {
      return <img src={ require('../../../../staticFiles/img/dashboard/350.png') } width="110" alt={ this.totalScore() } />;
    }
  }

  render() {
    return (
      <div class="statistics">
        <div class="block block-1">
          { this.totalScoreIcon() }
        </div>

        <div class="block block-2">
          <div class="large-text text-bold">{ this.state.statistics.averageLectionProgress + 0}%</div>
          <div class="regular-text">FERTIG</div>
        </div>

        <div class="block block-3">
          <div class="regular-text">MICRO<br />BLOGS</div>
          <div class="large-text">{ (this.state.statistics.microblogPoints + 0)}</div>
        </div>

        <div class="block block-4">
          <div class="regular-text">QUIZ</div>
          <br />
          <br />
          <div class="large-text">{ (this.state.statistics.quizPoints + 0)}</div>
        </div>

        <div class="block block-5">
          <div class="regular-text text-bold">AHA<br />SCORE</div>
          <br />
          <br />
          <div class="large-text text-bold">{ this.totalScore() }*</div>
        </div>

        <div class="block block-6">
          <div class="regular-text">COMMUNITY</div>
          <br />
          <br />
          <div class="large-text">{ (this.state.statistics.communityPoints + 0)}</div>
        </div>

      </div>
    );
  }
}
