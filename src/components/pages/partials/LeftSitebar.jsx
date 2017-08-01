import React from 'react';
import { subscribe, unsubscribe } from '../../../core/helpers/EventEmitter';
import { mapStepType } from '../../../core/helpers/Utils';
import CustomScroll from 'react-custom-scroll';

export default class LeftSitebar extends React.Component {

  constructor(props) {
    super(props);
    this.state = { steps: [] };

    this.lectionSteps = this.lectionStepsListener.bind(this);
  }

  lectionStepsListener(steps) {
    console.log('steps',steps)
    this.setState({ steps })
  }

  componentWillMount() {
    subscribe('lection:steps', this.lectionSteps);
  }

  componentWillUnmount() {
    unsubscribe('lection:steps', this.lectionSteps);
  }

  render() {
    return (
      <div class="left-sitebar left">
        <div class="lection-icon" style={{ backgroundImage: `url('${this.props.lection.img}')` }}></div>
          <div class="content-navigation">
            <ul>
              {this.state.steps.map((step) => (
                <li class={mapStepType(step.step.type).mapType + '-' + (step.step.completed ? 'inactive' : 'active')}
                    key={step.step.id}
                >
                  <div class={'title-text '.concat(step.step.completed ? 'inactive' : 'active')}
                       onClick={(e) => {
                         e.preventDefault();
                         this.props.handleNavigate(step.step, 'step');
                       }}
                  >
                    {mapStepType(step.step.type).title}
                  </div>
                  <div class="descr-text">{step.step.name}</div>
                  {
                    step.step.keylearningEnabled &&
                    <div class="title-text" onClick={(e) => {
                      e.preventDefault();
                      this.props.handleNavigate(step.step, 'keylearning');
                    }}>
                      MICROBLOG
                    </div>
                  }
                </li>
              ))}
            </ul>
          </div>
      </div>
    );
  }
};
