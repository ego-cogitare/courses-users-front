import React from 'react';
import { Link } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import User from '../../core/helpers/User';
import { selfAssignmentCompletion } from '../../core/helpers/Utils';
import Actual from './partials/dashboard/Actual.jsx';
import Selfcheck from './partials/dashboard/Selfcheck.jsx';
import MicroBlogs from './partials/dashboard/MicroBlogs.jsx';
import Library from './partials/dashboard/Library.jsx';
import Goals from './partials/dashboard/Goals.jsx';
import CommunityStream from './partials/dashboard/CommunityStream.jsx';
import Statistics from './partials/dashboard/Statistics.jsx';
import '../../staticFiles/css/dashboard.css';
import { subscribe, unsubscribe } from '../../core/helpers/EventEmitter';

export default class Dashboard extends React.Component {

  constructor() {
    super();

    this.state = {
      courseId: localStorage.getItem("currentCourseId"),
      saCompletionChecked: false
    };
    this.courseChanged = this.courseChangedListener.bind(this);

    // Check if self-assignment fully filled
    selfAssignmentCompletion(
      // Fully completed self assignment (do nothing)
      () => this.setState({ saCompletionChecked: true }),

      // Self assignment not completed yet (redirect to self assignment)
      () => location.hash = "#/start"
    );
  }

  componentWillMount() {
    subscribe('course:switched', this.courseChanged);
  }

  componentWillUnmount() {
    unsubscribe('course:switched', this.courseChanged);
  }

  componentDidMount() {
    // For pdf creating
    if (typeof window.callPhantom === 'function') {
      window.callPhantom({ func: 'afterLogin' });
    }
  }

  courseChangedListener(courseId) {
    this.setState({ courseId });
  }

  render() {
    return (
      <div class="wrapper dashboard" style={{ display: this.state.saCompletionChecked ? 'block' : 'none' }}>
        <Header />
        <div class="content">
          <div class="navigation clear">
            <div class="title">
              <span class="text-extra-bold">Willkommen zurück</span> {User.fullName}!
            </div>
            <div class="column left">
              <Actual courseId={this.state.courseId} />
              <Selfcheck courseId={this.state.courseId} />
              <Library courseId={this.state.courseId} />
            </div>
            <div class="column left">
              <MicroBlogs courseId={this.state.courseId} />
              <Goals courseId={this.state.courseId} />
            </div>
            <CommunityStream courseId={this.state.courseId} />
          </div>
          <Link to="/course" class="btn btn-large color7 border-color7 learn-weiter">
            Lern weiter
          </Link>
          <Statistics courseId={this.state.courseId} />
        </div>
        <Footer />
      </div>
    );
  }
}
