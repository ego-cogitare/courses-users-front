import React from 'react';
import { browserHistory } from 'react-router';
import Step1 from './partials/self-assignment/Step1.jsx';
import Step2 from './partials/self-assignment/Step2.jsx';
import Step3 from './partials/self-assignment/Step3.jsx';
import Step4 from './partials/self-assignment/Step4.jsx';
import Step5 from './partials/self-assignment/Step5.jsx';
import Step6 from './partials/self-assignment/Step6.jsx';
import Step7 from './partials/self-assignment/Step7.jsx';
import Step8 from './partials/self-assignment/Step8.jsx';
import { selfAssignmentCompletion } from '../../core/helpers/Utils';

export default class Selfassignment extends React.Component {

  constructor(props) {
    super(props);

    let options = window.location.search.slice(1)
                  .split('&')
                  .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                    b = b.split('=');
                    a[b[0]] = decodeURIComponent(b[1]);
                    return a;
                  }, {});

    if (options.pdf) {
      this.isPDF = true;
    }

    this.state = {
      currentStep: ''
    };

    // Scroll top on page load
    window.addEventListener(
      'load',
      () => setTimeout(() => window.scrollTo(0, 0), 100)
    );
  }

  componentWillMount() {
    // Check if current page available
    if (this.isPDF) {
      this.setState({ currentStep: this.props.params.step });
    }
    else {
      this.checkPageAvailability(this.props);
    }
  }

  step1NextClick() {
    browserHistory.push('#/self-assignment/step-2');
    this.setState({ currentStep: 'step-2' });
  }

  step2NextClick() {
    browserHistory.push('#/self-assignment/step-3');
    this.setState({ currentStep: 'step-3' });
  }

  step3NextClick() {
    browserHistory.push('#/self-assignment/step-4');
    this.setState({ currentStep: 'step-4' });
  }

  step4NextClick() {
    browserHistory.push('#/self-assignment/step-5');
    this.setState({ currentStep: 'step-5' });
  }

  step5NextClick() {
    browserHistory.push('#/self-assignment/step-6');
    this.setState({ currentStep: 'step-6' });
  }

  step6NextClick() {
    browserHistory.push('#/self-assignment/step-7');
    this.setState({ currentStep: 'step-7' });
  }

  step7NextClick() {
    browserHistory.push('#/self-assignment/step-8');
    this.setState({ currentStep: 'step-8' });
  }

  step8NextClick() {
    // If forwarder passed - return to forward page
    if (this.props.params.forwarder) {
      location.hash = `/${this.props.params.forwarder}`;
      return ;
    }
    location.hash = '/appointments';
  }

  componentWillReceiveProps(props) {
    // Check if current page available
    this.checkPageAvailability(props);
  }

  checkPageAvailability(props) {
    // Check if self-assignment fully filled
    selfAssignmentCompletion(
      // Fully completed self assignment redirect to dashboard
      () => {
        if (!(props.params.step === 'step-8' && props.params.forwarder === 'dashboard')) {
          location.hash = '#/dashboard';
        }
        // If all steps are completed - only step-8 is available to edit
        else {
          this.setState({ currentStep: 'step-8' });
        }
      },

      // Self assignment not completed yet (switch step)
      (lastCompleted) => {
        console.log('lastCompleted', lastCompleted)
        // Redirect to dashboard as default
        let redirectToStep = '';

        switch (lastCompleted) {
          case 'questions':
            redirectToStep = 'step-2';
          break;

          case 'thermometer':
            redirectToStep = 'step-6';
          break;

          case 'texts':
            redirectToStep = 'step-8';
          break;

          // case 'goals':
          // break;

          default:
            redirectToStep = 'step-1';
          break;
        }

        if (redirectToStep) {
          this.setState({ currentStep: redirectToStep }, () => {
            browserHistory.push(`#/self-assignment/${redirectToStep}`);
          });
        }
      }
    );
  }

  render() {
    switch (this.state.currentStep) {
      case 'step-1':
          return <Step1 isPDF={ this.isPDF } onNextStepClick={this.step1NextClick.bind(this)} />;
      break;

      case 'step-2':
        return <Step2 isPDF={ this.isPDF } onNextStepClick={this.step2NextClick.bind(this)} />;
      break;

      case 'step-3':
        return <Step3 isPDF={ this.isPDF } onNextStepClick={this.step3NextClick.bind(this)} />;
      break;

      case 'step-4':
        return <Step4 isPDF={ this.isPDF } onNextStepClick={this.step4NextClick.bind(this)} />;
      break;

      case 'step-5':
        return <Step5 isPDF={ this.isPDF } onNextStepClick={this.step5NextClick.bind(this)} />;
      break;

      case 'step-6':
        return <Step6 isPDF={ this.isPDF } onNextStepClick={this.step6NextClick.bind(this)} />;
      break;

      case 'step-7':
        return <Step7 isPDF={ this.isPDF } onNextStepClick={this.step7NextClick.bind(this)} />;
      break;

      case 'step-8':
        return <Step8 isPDF={ this.isPDF } onNextStepClick={this.step8NextClick.bind(this)} />;
      break;

      default:
        return null;
      break;
    }
  }
}
