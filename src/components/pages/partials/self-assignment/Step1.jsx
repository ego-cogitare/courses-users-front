import React from 'react';
import { updateStoredData, setStoredData, getStoredData } from '../../../../actions/User';
import '../../../../staticFiles/css/self-assignment/step-1.css';

export default class Step1 extends React.Component {

  constructor() {
    super();

    this.state = {
      questions: [
        {
          question: 'Ich bin eher zurückhaltend, reserviert.',
          mark: 0,
        },
        {
          question: 'Ich schenke anderen leicht Vertrauen, glaube an das Gute im Menschen.',
          mark: 0,
        },
        {
          question: 'Ich bin bequem, neige zur Faulheit.',
          mark: 0,
        },
        {
          question: 'Ich bin entspannt, lasse mich durch Stress nicht aus der Ruhe bringen.',
          mark: 0,
        },
        {
          question: 'Ich habe nur wenig künstlerisches Interesse.',
          mark: 0,
        },
        {
          question: 'Ich gehe aus mir heraus, bin gesellig.',
          mark: 0,
        },
        {
          question: 'Ich neige dazu, andere zu kritisieren.',
          mark: 0,
        },
        {
          question: 'Ich erledige Aufgaben gründlich.',
          mark: 0,
        },
        {
          question: 'Ich werde leicht nervös und unsicher.',
          mark: 0,
        },
        {
          question: 'Ich habe eine aktive Vorstellungskraft, bin fantasievoll.',
          mark: 0,
        },
      ],
      visitMode: null,
      configChecked: false
    };

    // Try to get stored config
    getStoredData({ key: 'questions' },
      (r) => {
        try {
          JSON.parse(r.json).forEach(({ mark }, key) => {
            Object.assign(this.state.questions[key], { mark });
          });
          this.setState({
            questions: this.state.questions,
            visitMode: 'back',
            configChecked: true
          });
        }
        catch (e) {
        }
      },
      (e) => {
        // Request to server is OK but stored data was not found: first page visit
        if (e.status === 404) {
          this.setState({
            questions: this.state.questions,
            visitMode: 'first',
            configChecked: true
          });
        }
        console.error(e);
      }
    )
    .always(
      () => setTimeout(() => window.scrollTo(0, 0), 100)
    );
  }

  validateAnswers() {
    let isValid = true;

    this.state.questions.map((question) => {
      Object.assign(question, { hasError: !question.mark });

      // Set errors existing flag
      if (!question.mark) {
        isValid = false;
      }
    });
    this.setState({ questions: this.state.questions });

    return isValid;
  }

  nextStepHandler(e) {
    e.preventDefault();

    // Check if no zero answers exists
    if (!this.validateAnswers()) {
      return ;
    }

    const data = {
      key: 'questions',
      json: JSON.stringify(this.state.questions)
    };

    // Check for config checked and availability
    if (this.state.configChecked) {
      (this.state.visitMode === 'first') ?
        // Try to save data and go to the next step on success save
        setStoredData(data,
          // Navigate to the next step
          (r) => this.props.onNextStepClick(),
          (e) => console.error(e)
        ) :
        // Try to update data and go to the next step on success save
        updateStoredData(data,
          // Navigate to the next step
          (r) => this.props.onNextStepClick(),
          (e) => console.error(e)
        );
    }
    else {
      console.error(`Config parse error. Check "${data.key}" config for the user.`);
    }
  }

  onPlusClick(question, e) {
    e.preventDefault();

    if (question.mark < 5) {
      question.mark++;
      this.setState({ questions: this.state.questions });
    }
  }

  onMinusClick(question, e) {
    e.preventDefault();

    if (question.mark > 0) {
      question.mark--;
      this.setState({ questions: this.state.questions });
    }
  }

  render() {
    return (
      <div class="content-wrapper self-assignment step-1">
        <div class="heads-bg"></div>
        <div class="tablet-bg"></div>
        <div class="content">
          <div class="title">
            <span class="text-extra-bold">Personality Check</span>
          </div>
          <div class="descr">
            Was macht Dich aus? Was treibt Dich an? Überlege zur Beantwortung dieser Fragen, inwieweit die folgenden Aussagen auf Dich zutreffen. Vergib dazu Punkte:
          </div>
          <ul class="marks text-center">
            <li><i class="mark">1=</i>nein</li>
            <li><i class="mark">2=</i>eher nein</li>
            <li><i class="mark">3=</i>weder noch</li>
            <li><i class="mark">4=</i>eher ja</li>
            <li><i class="mark">5=</i>ja</li>
          </ul>
          <ul class="answers">
            {
              this.state.questions.map((question, key) => (
                <li key={key} class={question.hasError ? 'error' : ''}>
                  <i class="number left">{key + 1}</i><span>{question.question}</span>
                  <span class="user-mark text-right">
                    <i class="minus" onClick={this.onMinusClick.bind(this, question)}>-</i>
                    <span class="mark">{question.mark}</span>
                    <i class="plus" onClick={this.onPlusClick.bind(this, question)}>+</i>
                  </span>
                </li>
              ))
            }
          </ul>
          <div class="navigation clear">
            {/*<div class="hexagon left">
              <span>Dein Ergebnis anzeigen</span>
            </div>*/}
            <div class="right btn text-bold" onClick={this.nextStepHandler.bind(this)}>WEITER</div>
          </div>
        </div>
      </div>
    );
  }
}
