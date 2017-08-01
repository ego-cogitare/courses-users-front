import React from 'react';
import { Link } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import User from '../../core/helpers/User';
import { bigCalendarGermanLocale } from '../../core/helpers/Utils';
import { list, attach, tutorsList, actualForUser } from '../../actions/Appointments';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../staticFiles/css/calendar.css';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

export default class Appointments extends React.Component {

  constructor(props) {
    super(props);

    // Set german locale
    moment.locale('de');

    BigCalendar.setLocalizer(
      BigCalendar.momentLocalizer(moment)
    );

    this.state = {
      events: [],
      tutors: [],
      view: 'week',

      // Flag for subscribe/unsubscribe dialog visibility manipulation
      isSubscribeDialogVisible: false,

      // Flag for over limitation notification visibility manipulation
      isNotifyDialogVisible: false,

      selectedEvent: {
        title: '',
        start: new Date(),
        end: new Date()
      }
    };

    // 45 minutes
    this.lessonDuration = 2700000;
  }

  componentWillMount() {
    // Extract all tutors
    tutorsList({ courseId: localStorage.getItem('currentCourseId') },
      (tutors) => {
        this.setState({ tutors });

        // Fetch appointments list
        this.fetchAppointments({
          courseId: localStorage.getItem('currentCourseId'),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        });
      },
      (e) => console.error(e)
    );
  }

  getTutorById(id) {
    const tutor = this.state.tutors.filter((tutor) => tutor.id === id)[0];
    return tutor ? tutor.firstName + ' ' + tutor.lastName : '';
  }

  fetchAppointments(data) {
    list(data,
      (r) => {
        this.setState({
          events: r
            // Only free appointments or reserved by a current user are shown
            .filter(
              (event) => {
                return (!event.userId || event.userId === User.data.id) && event.forDate > Date.now() ||
                       (event.userId === User.data.id && event.forDate < Date.now());
              }
            )

            // Fill appointments list
            .map(({ id, forDate, userId, tutorId }) => ({
              id,
              userId,
              title: this.getTutorById(tutorId),
              start: new Date(forDate),
              end: new Date(forDate + this.lessonDuration)
            })
          )
        });
      },
      (e) => console.error(e)
    );
  }

  onMonthChange(event) {
  }

  onSelectEvent(event) {
    // If appointment already busy by another user or appointment is obsolette
    if (event.start < Date.now()) {
      return ;
    }

    // Check if no active appointments exists
    actualForUser({ courseId: localStorage.getItem('currentCourseId') },
      (appointments) => {
        // If no actual appointments or active appointment selected (allow to unsubscribe)
        if (appointments.filter(({ forDate }) => forDate > Date.now()).length === 0 || event.userId) {
          this.setState({
            isSubscribeDialogVisible: true,
            selectedEvent: event
          });
        }
        // If no actual appointments
        else {
          this.setState({ isNotifyDialogVisible: true });
        }
      },
      (e) => console.error(e)
    );
  }

  confirmSubscribe() {
    // Attach user to lesson
    attach({ eventId: this.state.selectedEvent.id },
      (r) => {
        this.state.selectedEvent.userId ?
          Object.assign(this.state.selectedEvent, { userId: null }) :
          Object.assign(this.state.selectedEvent, { userId: User.data.id });

        this.setState({
          events: this.state.events,
          isSubscribeDialogVisible: false
        });
      },
      (e) => console.error(e)
    );
  }

  getDate(event) {
    return {
      day: new Date(event).getDate(),
      month: new Date(event).getMonth() + 1,
      year: new Date(event).getFullYear(),
      toString: function() {
        return this.year + '-' + this.month + '-' + this.day;
      }
    };
  }

  onSelecting() {
    return false;
  }

  eventWrapper({ event, children }) {
    // Expand width of the cell to 100%
    Object.assign(children.props.style, { width: '100%' });

    // If user set for the lesson
    event.userId && Object.assign(children.props.style, {
      background: '#2e74e6',
      border: 'none'
    });

    // Mark obsolette events
    event.start < Date.now() && Object.assign(children.props.style, {
      background: 'rgb(160, 160, 160)',
      border: 'none'
    });

    return (
      <div style={children.props.style} class="rbc-event" onClick={this.onSelectEvent.bind(this, event)}>
        <div class="rbc-event-label">{moment(event.start).format('HH:mm')} — {moment(event.end).format('HH:mm')}</div>
        <br/>Tutor<br/>{event.title}
      </div>
    );
  }

  subscribeDialogWrapper() {
    return (
      <Rodal visible={this.state.isSubscribeDialogVisible}
             height={178}
             showCloseButton={false}
             animation='fade'
             onClose={() => {}}
       >
        <div class="modal-header">
          <h4 class="modal-title">{this.state.selectedEvent.userId ? 'Termin-Absage:' : 'Bestätige Deinen Termin:'}</h4>
        </div>
        {
          this.state.selectedEvent.userId ?
            <div class="modal-body">
              Möchtest Du wirklich Deinen Termin zum Micro-Coaching mit <span class="text-bold">"{this.state.selectedEvent.title}"</span> am <span class="text-bold">{moment(this.state.selectedEvent.start).format('DD.MM.Y')}</span> um <span class="text-bold">{moment(this.state.selectedEvent.start).format('H:mm')} — {moment(this.state.selectedEvent.end).format('H:mm')}</span> absagen?
            </div> :
            <div class="modal-body">
              Möchtest Du einen Termin zum Micro-Coaching mit <span class="text-bold">"{this.state.selectedEvent.title}"</span> am <span class="text-bold">{moment(this.state.selectedEvent.start).format('DD.MM.Y')}</span> um <span class="text-bold">{moment(this.state.selectedEvent.start).format('H:mm')} — {moment(this.state.selectedEvent.end).format('H:mm')}</span> vereinbaren?
            </div>
        }
        <div class="modal-footer" style={{ padding: '10px 6px 0' }}>
          <button type="button" class="btn btn-default" onClick={() => this.setState({ isSubscribeDialogVisible: false })}>ABBRECHEN</button>
          <button type="button" class="btn" onClick={this.confirmSubscribe.bind(this)}>JA</button>
        </div>
      </Rodal>
    );
  }

  notificationDialogWrapper() {
    return (
      <Rodal visible={this.state.isNotifyDialogVisible}
             height={130}
             showCloseButton={false}
             animation='fade'
             onClose={() => {}}
      >
        <div class="modal-body">
          Du hast bereits einen Termin mit einem Tutor vereinbart. Falls Du einen neuen Termin möchtest, sage Deinen alten Termin ab.
        </div>
        <div class="modal-footer" style={{ padding: '10px 6px 0' }}>
          <button type="button" class="btn btn-default" onClick={() => this.setState({ isNotifyDialogVisible: false })}>ABBRECHEN</button>
        </div>
      </Rodal>
    );
  }

  render() {
    let today = moment();
    let am8 = today.set('hour', 8).set('minutes', 0).toDate();
    let pm22 = today.set('hour', 22).set('minutes', 0).toDate();

    return (
      <div class="wrapper calendar appointments h100p">
        <Header />
        <div class="content clear">
          <div class="clear">
            <h2 class="title left">Wähle einen Termin für Dein persönliches Micro Coaching</h2>
            <Link to={'/dashboard'} className="right btn" style={{ marginRight: -115 }}>Weiter</Link>
          </div>
          { this.subscribeDialogWrapper() }
          { this.notificationDialogWrapper() }
          <div class="left big-calendar">
            <BigCalendar
              views={['week']}
              ref="big-calendar"
              defaultView='week'
              messages={{ next: 'vor', today: 'Heute', previous: 'zurück' }}
              timeslots={1}
              step={15}
              toolbar={true}
              selectable={true}
              events={this.state.events}
              min={am8}
              max={pm22}
              onSelecting={this.onSelecting.bind(this)}
              onNavigate={this.onMonthChange.bind(this)}
              formats={ bigCalendarGermanLocale }
              components={{
                eventWrapper: this.eventWrapper.bind(this)
              }}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
