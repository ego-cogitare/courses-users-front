import React from 'react';
import { Link } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import User from '../../core/helpers/User';
import { bigCalendarGermanLocale } from '../../core/helpers/Utils';
import { list, add, update, remove } from '../../actions/Calendar';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import CustomScroll from 'react-custom-scroll';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../staticFiles/css/calendar.css';
import { getStoredData } from '../../actions/User';

export default class Calendar extends React.Component {

  constructor(props) {
    super(props);

    // Set german locale
    moment.locale('de');

    BigCalendar.setLocalizer(
      BigCalendar.momentLocalizer(moment)
    );

    this.state = {
      events: [],
      monthGoals: [],
      selfCheckGoals: [],
      dayGoals: [],
      selectedDate: this.getDate(new Date()).toString(),
      selectedEvent: {},
      view: 'month'
    };

    this.currentMonth = new Date().getMonth();
  }

  componentWillMount() {
    // Fetch calendar goals
    this.fetchGoals(new Date());

    // Fetch self check goals
    this.fetchSelfCheckGoals();
  }

  fetchSelfCheckGoals() {
    getStoredData({ key: 'goals' },
      (r) => this.setState({ selfCheckGoals: JSON.parse(r.json) }),
      (e) => console.log(e)
    );
  }

  fetchGoals(event) {
    list({ ...this.getDate(event) },
      (r) => this.setState({
        view: r.length > 0 ? 'month' : 'day',
        monthGoals: r,
        dayGoals: [],
        selectedDate: this.getDate(event).toString(),
        events: r.map(({ id, forDate, title, text }) => ({
          id,
          title,
          description: text,
          start: new Date(forDate),
          end: new Date(forDate),
        }))
      }),
      (e) => console.error(e)
    );
  }

  getDateGoals(date) {
    return this.state.monthGoals.filter(({ forDate }) => this.getDate(forDate).toString() === date.toString());
  }

  onMonthChange(event) {
    this.currentMonth = new Date(event).getMonth();
    this.fetchGoals(event);
  }

  onDaySelect(event) {
    const selectedDate = this.getDate(event.start);

    // Deny show dates not in current month
    if (new Date(event.start).getMonth() !== this.currentMonth) {
      return ;
    }

    // Seek for current date goals
    this.setState({
      view: 'day',
      dayGoals: this.getDateGoals(selectedDate),
      selectedDate: selectedDate.toString()
    });
  }

  onEventSelect(event) {
    this.setState({
      view: 'event',
      selectedEvent: event
    });
    setTimeout(() => {
      this.refs['goal-title'].value = event.title;
      this.refs['goal-description'].value = event.description;
    }, 100);
  }

  getDate(event) {
    let date = {
      day: new Date(event).getDate(),
      month: new Date(event).getMonth() + 1,
      year: new Date(event).getFullYear(),
      toString: function() {
        return this.year + '-' + this.month + '-' + this.day;
      }
    };
    if (date.day < 10) {
      date.day = '0' + date.day;
    }
    if (date.month < 10) {
      date.month = '0' + date.month;
    }
    return date;
  }

  addGoal(e) {
    e.preventDefault();

    const data = {
      title: this.refs['goal-title'].value,
      text: this.refs['goal-description'].value,
      forDate: moment(this.state.selectedDate).format('x')
    };
    
    add(data,
      (r) => {
        this.refs['goal-title'].value = '';
        this.refs['goal-description'].value = '';

        Object.assign(data, {
          id: r.id,
          description: r.text,
          start: new Date(r.forDate),
          end: new Date(r.forDate),
          forDate: r.forDate
        });

        this.setState({
          dayGoals: [...this.state.dayGoals, data],
          monthGoals: [...this.state.monthGoals, data],
          events: [...this.state.events, data]
        });
      },
      (e) => console.error(e)
    );
  }

  updateGoal() {
    const data = {
      title: this.refs['goal-title'].value,
      description: this.refs['goal-description'].value
    };

    update({
      goalId: this.state.selectedEvent.id,
      text: data.description,
      title: data.title,
      forDate: moment(this.state.selectedEvent.start).format('x')
    },
      (r) => {
        Object.assign(this.state.selectedEvent, { ...data });
        this.setState({ events: this.state.events });
      },
      (e) => console.error(e)
    );
  }

  deleteGoal() {
    remove(this.state.selectedEvent.id,
      (r) => this.setState({
        events: this.state.events.filter(
          (event) => event.id !== this.state.selectedEvent.id
        ),
        monthGoals: this.state.monthGoals.filter(
          (event) => event.id !== this.state.selectedEvent.id
        ),
        dayGoals: this.state.dayGoals.filter(
          (event) => event.id !== this.state.selectedEvent.id
        ),
        view: 'day'
      }),
      (e) => console.error(e)
    );
  }

  render() {
    let goalNumber = 0;

    return (
      <div class="wrapper calendar h100p">
        <Header />
        <div class="content clear">
          <div class="clear">
            <Link to={'/dashboard'} className="right btn" style={{ marginRight: -88 }}>Weiter</Link>
          </div>
          <div class="left big-calendar">
            <BigCalendar
              ref="big-calendar"
              views={['month']}
              toolbar={true}
              popup={true}
              selectable={true}
              events={this.state.events}
              onSelectSlot={this.onDaySelect.bind(this)}
              onSelectEvent={this.onEventSelect.bind(this)}
              onNavigate={this.onMonthChange.bind(this)}
              formats={ bigCalendarGermanLocale }
              messages={{ next: 'vor', today: 'Heute', previous: 'zurück' }}
              components={{
                dateCellWrapper: (event) => {
                  return (
                    <div
                      style={event.children.props.style}
                      class={this.state.selectedDate === this.getDate(event.value).toString() ? 'rbc-day-bg rbc-today' : 'rbc-day-bg'}
                    />
                  );
                }
              }}
            />
          </div>
          <CustomScroll heightRelativeToParent="calc(600px)">
            <div class="left goals-wrapper">
              {
                (this.state.view === 'event') && (
                  <div>
                    <div class="text-bold title">
                      {this.state.selectedEvent.title}
                    </div>
                    <div class="new-goal clear">
                      <input ref="goal-title" type="text" placeholder="To Do" />
                      <textarea ref="goal-description" type="text" placeholder="Beschreibe dein To Do" required></textarea>
                      <button class="color-primary" type="submit" onClick={this.updateGoal.bind(this)}>Update</button>
                      <button class="color-danger" type="submit" onClick={this.deleteGoal.bind(this)}>Delete</button>
                    </div>
                  </div>
                )
              }
              {
                (this.state.view !== 'event') && 
                <div>
                  {
                        moment(this.state.selectedDate).format('x') >= moment().startOf('day') &&
                        <div class="new-goal clear">
                          <form onSubmit={this.addGoal.bind(this)} action="">
                            <input ref="goal-title" type="text" placeholder="To Do" required />
                            <textarea ref="goal-description" type="text" placeholder="Beschreibe dein To Do" required></textarea>
                            <button type="submit">Hinzufügen</button>
                          </form>
                        </div>
                      }
                </div>
              }
              {
                this.state.selfCheckGoals.length > 0 ?
                <div style={{ marginBottom: '30px' }}>
                  <div class="text-bold title">
                    Lernziele
                  </div>
                  <ul>
                    {
                      this.state.selfCheckGoals.map((goal, key) => (
                        goal.trim() &&
                        <li key={key}>
                          <div class="title text-bold"><span class="goal">Ziel #{++goalNumber}: </span>{goal}</div>
                        </li>
                      ))
                    }
                  </ul>
                </div> : null
              }
              {
                (this.state.view === 'day') && (
                  <div>
                    <div class="text-bold title">
                      {moment(this.state.selectedDate).format('DD MMMM Y')} <span  style={{ color: '#888' }}>{'(' + this.state.dayGoals.length + ')'}</span>
                    </div>
                    <ul>
                    {
                      this.state.dayGoals.map(({ title, text, id }, i) => (
                        <li key={id}>
                          <div class="title text-bold"><span class="goal">Ziel #{i + 1}: </span>{title}</div>
                          <div class="descr">{text}</div>
                        </li>
                      ))
                    }
                    </ul>
                  </div>
                )
              }
              {
                (this.state.view === 'month') && (
                  <div>
                    <div class="text-bold title">
                      {moment(this.state.selectedDate).format('MMMM Y')} <span style={{ color: '#888' }}>{'(' + this.state.monthGoals.length + ')'}</span>
                    </div>
                    <ul>
                    { this.state.monthGoals.map(({ title, text, id }, i) => (
                        <li key={id}>
                          <div class="title text-bold"><span class="goal">Ziel #{i + 1}: </span>{title}</div>
                          <div class="descr">{text}</div>
                        </li>
                      ))
                    }
                    </ul>
                  </div>
                )
              }
            </div>
          </CustomScroll>
        </div>
        <Footer />
      </div>
    );
  }
}
