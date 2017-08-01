import React from 'react';
import ReactDOM from 'react-dom';
import { Checkbox } from 'react-icheck';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { allSelfCheck } from '../../actions/Lection';
import WidgetWrapper from './partials/WidgetWrapper.jsx';
import 'icheck/skins/all.css';
import '../../staticFiles/css/lesson.css';

export default class SaPrintable extends React.Component {

  constructor(props) {
    super(props);

    this.state = { steps: [] };
  }

  componentWillMount() {
    // Fetch all self check data
    allSelfCheck({ courseId: this.props.params.courseId },
      ({ steps, data }) => this.setState({ steps, data }),
      (e) => console.error(e)
    );
  }

  render() {

    return (
      <div class="wrapper lesson self-assignment step-6" style={{ minHeight: '100%' }}>
        <div class="heads-bg"></div>
        <div class="tablet-bg"></div>

        <div class="content" style={{ minHeight: 'auto', background: 'none' }}>
          <header class="clear w100p">
            <div class="logo-wrapper left clear">
              <div class="logo left">
                <a href="#">
                  <img src={require('../../staticFiles/img/self-assignment/step-2-3-4/logo.png')} alt="Logo" />
                </a>
              </div>
              <div class="text left">Creative learning space</div>
            </div>
          </header>
        </div>

        <div class="content" style={{ width: '560px', marginTop: '0', background: 'none' }}>
          <div class="course left">
            {
              this.state.steps.map((step, index) => (
                <div key={step.id} class="step" style={{ paddingBottom: 0 }}>
                  <div class="title">
                    Teamrollen
                  </div>
                  <WidgetWrapper unshow={true} step={step} />
                </div>
              ))
            }
          </div>
          <div class="clear" style={{marginBottom: 10}} />
        </div>
      </div>
    );
  }
}
