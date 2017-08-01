import React from 'react';
import Messager from '../../../../core/helpers/Messanger';
import { tutorsList, countUnread } from '../../../../actions/Messanger';
import { subscribe, unsubscribe } from '../../../../core/helpers/EventEmitter';
import Avatar from '../../../../core/helpers/Avatar';
import User from '../../../../core/helpers/User';
import CustomScroll from 'react-custom-scroll';
import Moment from 'moment';

export default class MessengerComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      unreadMessages: 0,
      messangerOpened: false,
      selectedTutor: {},
      activeScreen: 'courses', // courses|tutors|write|inbox
      coursesList: [],
      tutorsList: [],
    };

    this.onCoursesListFetch = this.onCoursesListFetchListener.bind(this);
    subscribe('course:list', this.onCoursesListFetch);
  }

  componentDidMount() {
    this.messager = new Messager((messages) => {
        let tutorId = this.state.selectedTutor.id;
        if (this.state.activeScreen === 'write' && this.state.messangerOpened === true) {
            let message = messages[0];
            if (message.userId === tutorId  || message.toUserId === tutorId) {
                this.setState(
                    (prevState) => ({
                        messages: prevState.messages.concat(messages)
                    }),
                    () => this.scrollMessangerBottom()
                );
                this.makeRead(tutorId);
            }
        }

        else {
            this.setState(
                (prevState) => ({
                    unreadMessages: prevState.unreadMessages + messages.length
                })
            );
        }

    });
    this.messager.connect(() => { });
    this.getCountUnread();
  }

  makeRead(tutorId) {
      this.messager.makeRead(tutorId);
      setTimeout(() => {
          this.getCountUnread();
      }, 500);
  }

  getCountUnread() {
      countUnread({}, (r) => {
          this.setState({
              unreadMessages: r.count
          });

      }, (e) => console.error(e));
  }

  scrollMessangerBottom() {
    $(this.refs.messanger.refs.innerContainer).scrollTop(999999999);
  }

  componentWillUnmount() {
    unsubscribe('course:list', this.onCoursesListFetch);
    this.messager.websocket && this.messager.close();
  }

  onCoursesListFetchListener(coursesList) {
    this.setState({ coursesList });
  }

  onCourseSelect(course, e) {
    e.preventDefault();

    // Fetch tutors list
    tutorsList({ courseId: course.id },
      (tutorsList) => {
        this.setState({ tutorsList, activeScreen: 'tutors' });
      },
      (e) => console.error(e)
    );
  }

  onTutorSelect(tutor, e) {
    e.preventDefault();
    this.messager.getMessages(tutor.id, 0, 200);
    this.setState({ activeScreen: 'write', selectedTutor: tutor, messages: [] });
    this.messager.makeRead(tutor.id);
    setTimeout(() => this.getCountUnread(), 200);
  }

  navigateTo(activeScreen) {
    this.setState({ activeScreen });
  }

  switchPopup(e) {
    e.preventDefault();
    this.setState(
      { messangerOpened: !this.state.messangerOpened },
      () => {
        if (this.state.messangerOpened) {
          this.scrollMessangerBottom();

          if (this.state.activeScreen == 'write') {
            this.makeRead(this.state.selectedTutor.id);
          }

        }
      }
    );
  }

  getTutorName(tutor) {
    return tutor.firstName + ' ' + tutor.lastName;
  }

  sendMessageTutor(e) {

    this.messager.sendMessage({
        text     : e.target.value,
        title    : `${User.fullName} wrote:`,
        toUserId : this.state.selectedTutor.id,
        courseId: localStorage.getItem('currentCourseId'),
        //lectionId: this.props.lectionId,
        avatar   : User.avatar
    });

    e.target.value = '';
  }

  renderUI(section) {
    switch (section) {
      case 'courses':
        return (
          <div>
            <div class="write clear">
              <div class="title-1">MESSENGER</div>
              {/*<div class="title-2 left"></div>*/}
              {/*<div class="submit right">schließen</div>*/}
            </div>
            <div class="courses">
              <ul>
                {
                  this.state.coursesList.map((course) => (
                    <li key={course.id} onClick={this.onCourseSelect.bind(this, course)}>{course.name}</li>
                  ))
                }
              </ul>
            </div>
            <div class="inbox clear">
                <div onClick={() => this.setState({ messangerOpened: false })} class="right">schließen</div>
            </div>
          </div>
        );
      break;

      case 'tutors':
        return (
          <div>
            <div class="write clear">
              <div class="title-1">MESSENGER</div>
              {/*<div class="title-2 left">Select tutor</div>*/}
              {/*<div class="submit right">schließen</div>*/}
            </div>
            <div class="tutors">
              <ul>
                {
                  this.state.tutorsList.map((tutor) => (
                    <li key={tutor.id} onClick={this.onTutorSelect.bind(this, tutor)}>{this.getTutorName(tutor)}</li>
                  ))
                }
              </ul>
            </div>
            <div class="inbox clear">
              <div onClick={this.navigateTo.bind(this, 'courses')} class="right">zurück</div>
              <div onClick={() => this.setState({ messangerOpened: false })} class="right" style={{ marginRight: 10 }}>schließen</div>
            </div>
          </div>
        );
      break;

      case 'write':
        return (
          <div>
            <div class="write clear">
              <div class="title-1">MESSENGER</div>
              <div class="title-2 left">Neue Nachricht schreiben</div>
              {/*<div class="submit right">schließen</div>*/}
            </div>
            <div class="user-name clear">
              <div class="left an">
                An: <span class="text-bold">{this.getTutorName(this.state.selectedTutor)}</span>
              </div>
            </div>
            <div class="history">
              <CustomScroll heightRelativeToParent="calc(250px)" ref="messanger">
              {
                this.state.messages.map((m) => ((
                  m.userId == this.state.selectedTutor.id ?
                  <div key={m.id} class="direct-chat-msg">
                      <div class="direct-chat-info clear">
                          <span class="direct-chat-name left">{this.getTutorName(this.state.selectedTutor)}</span>
                          <span class="direct-chat-timestamp right">{ Moment.unix(m.dateCreated / 1000).format('dd MMM h:mm a') }</span>
                      </div>
                      <img class="direct-chat-img" src={ require('../../../../staticFiles/img/avatars/default.png') } alt="Tutor avatar" />
                      <div class="direct-chat-text">
                          { m.text }
                      </div>
                  </div> :
                  <div key={m.id} class="direct-chat-msg own-message">
                      <div class="direct-chat-info clear">
                          <span class="direct-chat-name right">{User.fullName}</span>
                          <span class="direct-chat-timestamp left">{ Moment.unix(m.dateCreated / 1000).format('dd MMM h:mm a') }</span>
                      </div>
                      <img class="direct-chat-img" src={ User.avatar ? Avatar.toLink(User.avatar) : require('../../../../staticFiles/img/avatars/default.png') } alt="Your avatar" />
                      <div class="direct-chat-text">
                          { m.text }
                      </div>
                  </div>
                )))
              }
              </CustomScroll>
            </div>
            <div class="new-message">
              <input type="text" placeholder="Schreibe hier…" onKeyDown={(e) => (e.keyCode === 13) && this.sendMessageTutor(e)} />
            </div>
            <div class="inbox clear">
                <div onClick={this.navigateTo.bind(this, 'tutors')} class="right">zurück</div>
                <div onClick={() => this.setState({ messangerOpened: false })} class="right" style={{ marginRight: 10 }}>schließen</div>
            </div>
          </div>
        );
      break;
    }
  }

  render() {
    return (
      <div class="messanger right">
        <a class={"messages".concat(this.state.unreadMessages > 0 ? " has-unread" : "")}
           href="#"
           data-count={this.state.unreadMessages}
           onClick={this.switchPopup.bind(this)}
        >
          <img src={require("../../../../staticFiles/img/messages-new.png")} alt="Messages" />
        </a>
        <div class={'message-popup'.concat(this.state.messangerOpened ? '' : ' hidden')}>
          { this.renderUI(this.state.activeScreen) }
        </div>
      </div>
    );
  }
}
