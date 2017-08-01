import React from 'react';
import { Link } from 'react-router';
import MessengerComponent from './widgets/MessengerComponent.jsx';
import { list } from '../../../actions/Course';
import { dispatch, subscribe, unsubscribe } from '../../../core/helpers/EventEmitter';
import '../../../staticFiles/css/header.css';

export default class Header extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      coursesList: [],
      currentCourse: {}
    };

    // Fetch courses list
    list({});

    this.onCoursesListFetch = this.onCoursesListFetchListener.bind(this);
    subscribe('course:list', this.onCoursesListFetch);
  }

  onCoursesListFetchListener(coursesList) {
    this.setState({ coursesList });

    let courseId = localStorage.getItem('currentCourseId');
    if (courseId) {
      this.setState({
        currentCourse: coursesList.filter((course) => course.id === courseId)[0]
      });
    }
    else {
      localStorage.setItem('currentCourseId', coursesList[0].id);
      dispatch('course:switched', coursesList[0].id);
    }
  }

  componentWillUnmount() {
    unsubscribe('course:list', this.onCoursesListFetch);
  }

  componentDidMount() {
    $(window).bind('scroll', () => {
      $(window).scrollTop() > 200
        ? $(this.refs.header).addClass('small-header')
        : $(this.refs.header).removeClass('small-header');
    });
  }

  onCourseSwitch(id, e) {
    e.preventDefault();

    localStorage.setItem('currentCourseId', id);
    this.setState({
      currentCourse: this.state.coursesList.filter((course) => course.id === id)[0]
    });
    dispatch('course:switched', id);
  }

  render() {
    return (
      <div class="header w100p" ref="header">
        <div class="menu-wrapper clear">
          <a class="logo left" href="#">
            <img src={require("../../../staticFiles/img/logo.png")} width="46" alt="Logo" />
          </a>
          <div class="text-center left header-menu">
            <ul class="menu">
              {
              this.state.coursesList.length > 1 &&
              <li class="menu-item">
                <a href="#">
                  {this.state.currentCourse.name}
                </a>
                <ul class="sub-menu">
                  {
                    this.state.coursesList.map(({ id, name }) => (
                      <li key={id} class="sub-menu-item">
                        <a onClick={this.onCourseSwitch.bind(this, id)}>{name}</a>
                      </li>
                    ))
                  }
                </ul>
              </li>
              }
              <li class="menu-item">
                <Link to="/dashboard" activeClassName="active">dashboard</Link>
              </li>
              <li class="menu-item">
                <Link to="/course" activeClassName="active">bibliothek</Link>
              </li>
              <li class="menu-item">
                <Link to="/profile" activeClassName="active">profil</Link>
              </li>
              {/*<li class="menu-item">
                <Link to="/start">Self-Assignment</Link>
              </li>*/}
              {/*<li class="menu-item">
                <a href="#">hilfe</a>
              </li>*/}
            </ul>
          </div>
          <div class="logout right">
            <Link to="/logout">
              <img className="logout-btn" src={require("../../../staticFiles/img/icon_logout.png")} />
            </Link>
          </div>
          <MessengerComponent />
        </div>
      </div>
    );
  }
}
