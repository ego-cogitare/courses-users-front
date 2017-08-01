import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import Auth from './core/helpers/Auth';
import Layout from './components/pages/Layout.jsx';
import Login from './components/pages/Login.jsx';
import Register from './components/pages/Register.jsx';
import RecoveryPassword from './components/pages/RecoveryPassword.jsx';
import Course from './components/pages/Course.jsx';
import Quiz from './components/pages/Quiz.jsx';
import Lection from './components/pages/Lection.jsx';
import Profile from './components/pages/Profile.jsx';
import Dashboard from './components/pages/Dashboard.jsx';
import Calendar from './components/pages/Calendar.jsx';
import Microblogs from './components/pages/Microblogs.jsx';
import Start from './components/pages/Start.jsx';
import Selfassignment from './components/pages/Selfassignment.jsx';
import Appointments from './components/pages/Appointments.jsx';
import SaPrintable from './components/pages/SaPrintable.jsx';
import QuizPreview from './components/pages/QuizPreview.jsx';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/logout" component={null} onEnter={Auth.logout.bind(Auth)} />
    <Route path="/" component={Layout} onChange={Auth.routeChange.bind(Auth)} onEnter={Auth.routeEnter.bind(Auth)}>
      <IndexRoute component={Dashboard}></IndexRoute>
      <Route path="login" component={Login} />
      <Route path="recovery-password(/:id)" component={RecoveryPassword} />
      <Route path="register" component={Register} />
      <Route path="profile" component={Profile} />
      <Route path="dashboard" component={Dashboard} />
      <Route path="lection/:id(/:anchor)" component={Lection} />
      <Route path="course" component={Course} />
      <Route path="course/:id" component={Course} />
      <Route path="quiz/:courseId" component={Quiz} />
      <Route path="calendar" component={Calendar} />
      <Route path="microblogs" component={Microblogs} />
      <Route path="quiz/preview/:lectionId/:quizId" component={QuizPreview} />
      <Route path="start" component={Start} />
      <Route path="self-assignment/:step(/:forwarder)" component={Selfassignment} />
      <Route path="appointments" component={Appointments} />
      <Route path="sa-printable/:courseId" component={SaPrintable} />
    </Route>
  </Router>,
  document.getElementById('app')
);
