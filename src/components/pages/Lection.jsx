import React from 'react';
import ReactDOM from 'react-dom';
import { Checkbox } from 'react-icheck';
import { dispatch, subscribe, unsubscribe } from '../../core/helpers/EventEmitter';
import Header from './partials/Header.jsx';
import LeftSitebar from './partials/LeftSitebar.jsx';
import RightSitebar from './partials/RightSitebar.jsx';
import Footer from './partials/Footer.jsx';
import QuizLink from './partials/QuizLink.jsx';
import WidgetWrapper from './partials/WidgetWrapper.jsx';
import Keylearnings from './partials/Keylearnings.jsx';
import User from '../../core/helpers/User';
import { mapStepType, fetchLectionsProgress } from '../../core/helpers/Utils';
import { list, getQuizByLection } from '../../actions/Quiz';
import { get as getLection } from '../../actions/Lection';
import { markCompleted as setStepCompleted, markUncompleted as setStepUncompleted, completionState as getStepCompletion, listByUserAndCourseId as getSteps } from '../../actions/Step';
import 'icheck/skins/all.css';
import '../../staticFiles/css/lesson.css';
import { Link } from 'react-router';


export default class Lection extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lection: {},
      steps: [],
      lectionAvailable: true,
      progressFetched: false,
      showQuiz: false,
      showQuizPreview: false,
      quiz: {}
    };

    this.lectionGet = this.lectionGetListener.bind(this);
    this.lectionSteps = this.lectionStepsListener.bind(this);
    this.lectionStepsCompletion = this.lectionStepsCompletionListener.bind(this);

    /*  */
    fetchLectionsProgress(
      localStorage.getItem('currentCourseId'),
      (lections) => {
        lections.forEach((lection) => {
          (lection.id === this.props.params.id) &&
          this.setState({
            lectionAvailable: lection.available,
            progressFetched: true
          });
        });
      },
      (error) => console.error(error)
    );
  }

  lectionGetListener(lection) {
    this.setState({ lection });
  }

  // On steps list fetched
  lectionStepsListener(steps) {
    this.setState(
      { steps },
      () => {
        setTimeout(() => {
          this.props.params.anchor &&
          this.navigateToStep({ id: this.props.params.anchor }, 'step', -50);
        }, 500);
        this.justifyMenu();
      }
    );

    // Get steps completion states
    this.fetchStepsCompletionStates();
  }

  // Get steps completion states
  fetchStepsCompletionStates() {
    getStepCompletion(
      { lectionId: this.props.params.id },
      (r) => dispatch('lection:steps:completion', r),
      (e) => console.error(e)
    );
  }

  componentWillMount() {
    // Fetch lection data
    getLection({ id: this.props.params.id });

    // Fetch steps and keylearnings list
    getSteps({ lectionId: this.props.params.id, userId: User.data.id });

    subscribe('lection:get', this.lectionGet);
    subscribe('lection:steps', this.lectionSteps);
    subscribe('lection:steps:completion', this.lectionStepsCompletion);

    // Get quiz list
    list(
      { courseId: this.props.params.id },
      (r) => {

        if (r.id) {
            // Show quiz button

            r.id && this.setState({ showQuiz: true })
        }
        else {

          // Quiz finished show preview
          getQuizByLection(this.props.params.id, (r) => {
              if (r.length > 0) {
                this.setState({
                    showQuizPreview: true,
                    quiz: r[0]
                });
              }this.props.params.id
          });

        }



      },
      (e) => console.error(e)
    );

    $(window).bind('resize', this.justifyMenu.bind(this));
  }

  justifyMenu() {
    $('.left-sitebar .content-navigation').height($(window).height() - 225);
  }

  componentWillUnmount() {
    unsubscribe('lection:get', this.lectionGet);
    unsubscribe('lection:steps', this.lectionSteps);
    unsubscribe('lection:steps:completion', this.lectionStepsCompletion);
  }

  lectionStepsCompletionListener(payload) {
    this.state.steps.map((step) => {
      Object.assign(step.step, { completed: false, completedId: null });
      payload.map(({ id, stepId }) => {
        if (stepId === step.step.id) {
          Object.assign(step.step, { completed: true, completedId: id });
        }
      });
    });
    this.setState({ steps: this.state.steps });
  }

  componentDidUpdate() {
    let hash = this.props.location.hash.replace('#', '');
    if (hash) {
      let node = ReactDOM.findDOMNode(this.refs[hash]);
      if (node) {
        node.scrollIntoView();
      }
    }
  }

  navigateToStep(step, block, customOffset = 0) {
    const node = $('#' + block + '-' + step.id);
    if (node) {
      $('html, body').animate({
        scrollTop: $(node).offset().top - 40 + customOffset
      }, 500);
    }
  }

  /**
   * Checkbox step completion state changed
   */
  stepCompletionChange({ stepId, completed, index }) {
    // If step already marked as completed
    if (completed) {
      return ;
    }

    // Get previous step completion state (if not completed - rejection)
    if (index > 0) {
      const step = this.state.steps[index - 1];
      if (!step.step.completed) {
        return ;
      }
    }

    // Update step completion state
    setStepCompleted({ stepId },
      (r) => this.fetchStepsCompletionStates(),
      (e) => console.error(e)
    );
  }

  render() {

    return (
      <div class="wrapper lesson">
        {/* Header */}
        <Header />

        { /* Check if lection available */
          this.state.lectionAvailable ?
          <div class="content" style={{ display: this.state.progressFetched ? 'block' : 'none' }}>
            {/* Left sitebar */}
            <LeftSitebar
              handleNavigate={this.navigateToStep.bind(this)}
              lection={this.state.lection}
            />

            <div class="course left">
              <div class="title">
                <span class="text-extra-bold">{this.state.lection.title}</span>
              </div>

              {this.state.steps.map((step, index) => (
                <div key={step.step.id} class="step" id={'step-' + step.step.id}>
                  <div class="title">
                    {step.step.name}
                  </div>

                  {/* Step title and description */}
                  <div class="descr-wrapper clear">
                    <div class={"icon left type-" + mapStepType(step.step.type).mapType} />
                    <div class="descr left" dangerouslySetInnerHTML={{__html: step.step.description}} />
                  </div>
                  {/* Step title and description */}

                  {/* Step data */}
                  <WidgetWrapper step={step.step} />
                  {/* Step data */}

                  <label for={'step-' + step.step.id} class="mark-completed">
                    <Checkbox
                      checkboxClass="course-completion icheckbox_square-blue"
                      increaseArea="20%"
                      id={step.step.id}
                      checked={step.step.completed}
                      className="course-completion"
                      onChange={(e) => this.stepCompletionChange({
                        stepId: step.step.id,
                        completed: e.target.checked,
                        index
                      })}
                      />
                    <span>Check?</span>
                  </label>
                  <Keylearnings
                    step={step}
                    lectionId={this.props.params.id}
                    />
                </div>
              ))}
            </div>

            <div class="clear"></div>

            {/* Search */}
            { this.state.showQuiz && <QuizLink lectionId={this.props.params.id} /> }

            {/* Show Quiz Preview */}
            { this.state.showQuizPreview &&
              <div class="quiz-link">
                <div class="container clear">
                  <div class="left">
                    <div class="descr-text text-bold">
                    </div>
                  </div>
                  <div class="hexagon left">
                    <div class="icon quiz-owl-icon"></div>
                    <div class="title">
                      <Link to={`/quiz/preview/${this.props.params.id}/${this.state.quiz.id}`}>Teste dein Wissen</Link>
                    </div>
                  </div>
                </div>
              </div>
            }

          </div>
          :
          <div class="content">
            <div class="course">
              <div class="title text-center text-bold error" style={{ paddingTop: 35 }}>Lection is not available</div>
            </div>
          </div>
        }

        {/* Right sitebar */}
        { this.state.lectionAvailable && <RightSitebar lectionId={this.props.params.id} /> }

        {/* Footer */}
        <Footer />
      </div>
    );
  }
}
