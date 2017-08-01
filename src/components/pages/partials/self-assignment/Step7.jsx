import React from 'react';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { updateStoredData, setStoredData, getStoredData } from '../../../../actions/User';
import '../../../../staticFiles/css/self-assignment/step-7.css';

export default class Step7 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      text1: {
        title: 'Welche Deiner Eigenschaften, Kompetenzen oder Qualifikationen tragen besonders zur kreativen Problemlösung bei?',
        comment: ''
      },
      text2: {
        title: 'In welchen konkreten Situationen ist Dir die kreative Problemlösung bereits gut gelungen?',
        comment: ''
      },
      text3: {
        title: 'Wann und wo hast Du die besten Ideen?',
        comment: ''
      },
      text4: {
        title: 'Was tust Du, damit Dir Deine Ideen nicht verloren gehen?',
        comment: ''
      },
      text5: {
        title: 'Was blockiert Deine Kreativität?',
        comment: ''
      },
      text6: {
        title: 'Was tust Du normalerweise, wenn Du bei der Lösung eines Problems nicht weiterkommst?',
        comment: ''
      },
      text7: {
        title: 'Wo siehst Du Deinen größten Entwicklungsbedarf?',
        comment: ''
      },
      visitMode: null,
      configChecked: false
    };
  }

  componentWillMount() {
    // Try to get stored config
    getStoredData({ key: 'texts' },
        (r) => {
            try {
              const storedConfig = JSON.parse(r.json);
              this.setState((prev) => {
                let state = prev;
                Object.keys(storedConfig).forEach((key) => {
                  state[key].comment = storedConfig[key];
                });
                state.visitMode = 'back';
                state.configChecked = true;

                return state;
              });
            }
            catch (e) {
            }
        },
        (e) => {
            // Request to server is OK but stored data was not found: first page visit
            if (e.status === 404) {
                this.setState({
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

  nextStepHandler(e) {
    e.preventDefault();

    const data = {
      key: 'texts',
      json: JSON.stringify({
        'text1': this.state.text1.comment,
        'text2': this.state.text2.comment,
        'text3': this.state.text3.comment,
        'text4': this.state.text4.comment,
        'text5': this.state.text5.comment,
        'text6': this.state.text6.comment,
        'text7': this.state.text7.comment
      })
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

  onGoalChange(key, e) {
    this.setState({
      [key]: Object.assign(this.state[key], { title: this.state[key].title, comment: e.target.value })
    });
  }

  buttonNext() {
    return (
      <div class="clear weiter">
        <div class="btn right" onClick={this.nextStepHandler.bind(this)}>WEITER</div>
      </div>
    );
  }

  renderInputArea(key) {
    if (this.props.isPDF) {
      return(
        <div class="write-here" contentEditable="true" placeholder="Schreibe hier deine Antwort...">
          {this.state[key].comment}
        </div>
      );
    }
    else {
      return(
        <textarea
          class="write-here"
          value={this.state[key].comment}
          onChange={this.onGoalChange.bind(this, key)}
          placeholder="Schreibe hier deine Antwort..."
        />
      );
    }
  }

  render() {
    return (
      <div class="wrapper self-assignment step-7">
        <div class="heads-bg"></div>
        <div class="tablet-bg"></div>
        <div class="content">
          <Header />
          <section>
            <div class="title">
              <span class="text-extra-bold">Reflexionsfragen</span>
            </div>
            <div class="descr">
              Erzähle uns ein wenig über Dich. Die folgenden Fragen helfen Dir Deine Chancen und Herausforderungen besser zu verstehen.
            </div>
            {
              Object.keys(this.state).map((key, i) => {
                return (key.match(/text\d/))
                  ? <div class="row clear" key={key}>
                      <div class="number left">{i + 1}</div>
                      <div class="info-block left">
                        <div class="title">
                          {this.state[key].title}
                        </div>
                        { this.renderInputArea(key) }
                      </div>
                    </div>
                  : null;
              })
            }
            { !this.props.isPDF && this.buttonNext() }
          </section>
        </div>
        { !this.props.isPDF && <Footer /> }
      </div>
    );
  }
}
