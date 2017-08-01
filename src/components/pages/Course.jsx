import React from 'react';
import { Link } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { subscribe, unsubscribe } from '../../core/helpers/EventEmitter';
import { listByCourse, listProgressByCourse } from '../../actions/Lection';
import '../../staticFiles/css/lections.css';

export default class Course extends React.Component {

  constructor(props) {
    super(props);

    this.state = { lections: [] };
    this.fetchLection = this.fetchLectionListener.bind(this);
    this.fetchLectionListener(localStorage.getItem('currentCourseId'));

    // Scroll top on page load
    window.addEventListener(
      'load',
      () => setTimeout(() => window.scrollTo(0, 0), 100)
    );
  }

  componentWillMount() {
    subscribe('course:switched', this.fetchLection);
  }

  componentWillUnmount() {
    unsubscribe('course:switched', this.fetchLection);
  }

  fetchLectionListener(courseId) {
    listByCourse(
      { courseId },
      (lections) => listProgressByCourse({ courseId },
        (r) => {
          lections.forEach((lection, key) => {
            Object.assign(lection, {
              progress: r.filter(
                (progress) => progress.lectionId == lection.id
              )[0] || { percentageOfFinish: 0 }
            });
            // Check lection availability
            Object.assign(lection, { available:
              (key > 0) ? lections[key - 1].progress.percentageOfFinish === 100 : true
            });
          });
          this.setState({ lections: this.chunk(lections) }, () => {
            window.scrollTo(0, 0);
          });
        },
        (e) => console.error(e)
      ),
      (e) => console.error(e),
    );
  }

  chunk(array) {
    let result = [[], [], []];
    for (let i = 0; i < array.length; i++) {
      result[i % 3].push(array[i]);
    }
    return result;
  }

  checkLectionAvailable(available, e) {
    !available && e.preventDefault();
  }

  render() {
    return (
      <div class="wrapper library">
        <Header />

        <div class="content">
          <div class="navigation clear">
            <div class="title text-extra-bold">
              Übersicht Lektionen
            </div>
            {
              this.state.lections.map((chunk, key) => (
                <div key={key} class="column left">
                  {
                    chunk.map(({ id, img, title, description, progress, available }) => (
                      <div key={id} class="block-wrapper">
                        <div class={'title-wprapper'.concat(progress.percentageOfFinish ? ' completed' : '')}>
                          <span class="icon" style={{ backgroundImage: `url('${img}')` }}></span>
                          <Link to={`/lection/${id}`} onClick={this.checkLectionAvailable.bind(this, available)} class="title">{title}</Link>
                        </div>
                        <div class="descr">
                          {description}
                        </div>
                        <div class="stats-wrapper clear">
                          <div class={'progress-wrapper left'.concat(progress.percentageOfFinish === 100 ? ' completed' : '')}
                               data-progress={progress.percentageOfFinish + '%'}>
                            <div class="progress" style={{ width: progress.percentageOfFinish + '%' }}></div>
                          </div>
                          <div class={'btn right'.concat(available ? '' : ' disabled')}>
                            <Link class="text-bold" to={`/lection/${id}`} onClick={this.checkLectionAvailable.bind(this, available)}>LOS</Link>
                          </div>
                          <Link to={`/lection/${id}`} class="checkbox right"></Link>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
