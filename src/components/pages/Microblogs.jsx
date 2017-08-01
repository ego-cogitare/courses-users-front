import React from 'react';
import { Link } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { mapStepType } from '../../core/helpers/Utils';
import { subscribe, unsubscribe } from '../../core/helpers/EventEmitter';
import { fetchByCourseId, update } from '../../actions/Keylearning';
import '../../staticFiles/css/microblogs.css';

export default class Microblogs extends React.Component {

  constructor(props) {
    super(props);

    this.state = { data: [], savingProgress: [] };
    this.courseSwitched = this.courseSwitch.bind(this);
  }

  componentWillMount() {
    this.courseSwitch(localStorage.getItem('currentCourseId'));
    subscribe('course:switched', this.courseSwitched);
  }

  componentWillUnmount() {
    unsubscribe('course:switched', this.courseSwitched);
  }

  courseSwitch(courseId) {
    fetchByCourseId({ courseId },
      (data) => {
        let result = {};
        data.map(({ lectionEntity, step, keylearning }) => {
          result[lectionEntity.id] &&
          result[lectionEntity.id].data.push({step, keylearning}) ||
          Object.assign(result, {
            [lectionEntity.id]: {
              lectionEntity,
              data:[{ step, keylearning }]
            }
          });
        });
        this.setState({ data: result });
      },
      (e) => console.error(e),
    );
  }

  save(keylearning, e) {
    const data = {
      id: keylearning.id,
      courseId: keylearning.courseId,
      lectionId: keylearning.lectionId,
      stepId: keylearning.stepId,
      userId: keylearning.userId,
      text: this.refs[keylearning.id].value
    };

    this.updateLoader({ stepId: data.stepId, enabled: true });

    update(data,
      (r) => this.updateLoader({ stepId: data.stepId, enabled: false }),
      (e) => console.error(e)
    );
  }

  updateLoader({ stepId, enabled }) {
    this.state.savingProgress[stepId] = enabled;
    this.setState({ savingProgress: this.state.savingProgress });
  }

  render() {
    return (
      <div className="wrapper microblogs">
        <Header />

        <div class="content-wrapper">
          <div class="heads-bg"></div>
          <div class="tablet-bg"></div>
          <div class="content">
            <div class="title">
              <span class="text-extra-bold">Übersicht Micro Blogs</span>
            </div>

            {
              Object.keys(this.state.data).map((key) => {
                return (
                  <div class="block" key={key}>
                    <Link to={`/lection/${this.state.data[key].lectionEntity.id}`} className="title">
                      Lektion{/*}<i class="number">2</i>*/}: <span class="text-bold">{this.state.data[key].lectionEntity.title}</span>
                    </Link>
                    {
                      this.state.data[key].data.map(({ keylearning, step }) => (
                        <div key={step.id} class={'row'.concat(this.state.savingProgress[step.id] ? ' loading' : '')}>
                          <div class="descr-title">
                            <span class="text-bold">{mapStepType(step.type).title}: </span>
                              <Link to={`/lection/${this.state.data[key].lectionEntity.id}/${step.id}`} class="color-yellow">{step.name}</Link>
                          </div>
                          <textarea class="descr" ref={keylearning.id} defaultValue={keylearning.text} />
                          <i class="spinner fa fa-refresh fa-spin fa-3x fa-fw"></i>
                          <div class="text-right">
                            <div onClick={this.save.bind(this, keylearning)} class="btn text-bold">BEARBEITEN</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                );
              })
            }
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}
