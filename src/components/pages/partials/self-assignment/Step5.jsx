import React from 'react';
import { updateStoredData, setStoredData, getStoredData } from '../../../../actions/User';
import '../../../../staticFiles/css/self-assignment/step-1.css';

export default class Step5 extends React.Component {

  constructor() {
    super();

    this.state = {
      questions: [
        {
          question: 'Komplexe Projekte steuern.',
          mark: 0,
        },
        {
          question: 'Das Potenzial eines interdisziplinären Teams nutzen.',
          mark: 0,
        },
        {
          question: 'Zu sinnvollen Lösungen im Team kommen.',
          mark: 0,
        },
        {
          question: 'Mit unterschiedlichen Arbeitsstilen produktiv umgehen.',
          mark: 0,
        },
        {
          question: 'Verschiedene Ressourcen zur Lösung eines Problems nutzen.',
          mark: 0,
        },
        {
          question: 'Sinnvoll scheitern und durch Fehler lernen.',
          mark: 0,
        },
        {
          question: 'Schnell zu kreativen Lösungen im Team kommen.',
          mark: 0,
        },
        {
          question: 'Zeitnah auf veränderte Umstände reagieren.',
          mark: 0,
        },
        {
          question: 'Andere von den eigenen Ideen überzeugen.',
          mark: 0,
        },
        {
          question: 'Aus einer Flut von Informationen die nützlichsten herausfiltern.',
          mark: 0,
        },
        {
          question: 'Blockaden abbauen, die Kreativität verhindern.',
          mark: 0,
        },
        {
          question: 'Innovationsprozesse anstoßen. ',
          mark: 0,
        },
        {
          question: 'Flexibel auf neue Situationen reagieren.',
          mark: 0,
        },
        {
          question: 'Unsichere, offene und widersprüchliche Situationen aushalten.',
          mark: 0,
        },
        {
          question: 'Konflikte managen.',
          mark: 0,
        },
        {
          question: 'Kreative Ideen finden.',
          mark: 0,
        },
      ],
      visitMode: null,
      configChecked: false
    };

    // Try to get stored config
    getStoredData({ key: 'thermometer' },
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
      key: 'thermometer',
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
            <span class="text-extra-bold">Instruktion</span>
          </div>
          <div class="descr">
            Erzähle uns etwas über Deinen aktuellen Alltag. Überlege, ob Dich die folgenden Aufgaben herausfordern?
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
