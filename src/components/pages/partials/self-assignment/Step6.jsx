import React from 'react';
import { hashHistory } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { getStoredData } from '../../../../actions/User';
import '../../../../staticFiles/css/self-assignment/step-6.css';

export default class Step6 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      percent: 0,
      prevStep: 'self-assignment/step-1',
      topItems: [],
      isPDF: props.isPDF
    };

    // Try to get stored config
    getStoredData({ key: 'thermometer' },
      (r) => {
        try {
          let marks = [];
          let storedConfig = JSON.parse(r.json).sort((a, b) => b.mark > a.mark ? 1 : -1);

          // Get total 3 items
          this.setState({ topItems: storedConfig.slice(0, 3) });

          console.log('storedConfig', storedConfig);

          // Get total points sum
          let sum = 0;
          storedConfig.forEach(({ mark }) => sum += mark);

          if (sum <= 24) {
            this.setState({ percent: 15 });
          }
          else if (sum >= 25 && sum <= 27) {
            this.setState({ percent: 25 });
          }
          else if (sum >= 28 && sum <= 30) {
            this.setState({ percent: 35 });
          }
          else if (sum >= 31 && sum <= 33) {
            this.setState({ percent: 45 });
          }
          else if (sum >= 34 && sum <= 36) {
            this.setState({ percent: 54 });
          }
          else if (sum >= 37 && sum <= 39) {
            this.setState({ percent: 63 });
          }
          else if (sum >= 40 && sum <= 42) {
            this.setState({ percent: 73 });
          }
          else if (sum >= 43 && sum <= 45) {
            this.setState({ percent: 82 });
          }
          else if (sum >= 46 && sum <= 48) {
            this.setState({ percent: 92 });
          }
          else if (sum >= 49) {
            this.setState({ percent: 100 });
          }
        }
        catch (e) {
          console.error(e);
          hashHistory.push(this.state.prevStep);
        }
      },
      (e) => {
        if (!this.props.isPDF) {
            hashHistory.push(this.state.prevStep);
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
    this.props.onNextStepClick();
  }

  render() {
    let button =  <div class="navigation clear">
                    <div class="right btn text-bold" onClick={this.nextStepHandler.bind(this)}>WEITER</div>
                  </div>;

    return (
      <div class="wrapper self-assignment step-6">
        <div class="heads-bg"></div>
        <div class="tablet-bg"></div>
        <div class="content">
          <Header />

          <section class="clear">
            <div class="indicator left">
              <div class="progress-wrapper">
                <div class="indicator-progress" style={{ height: this.state.percent + '%' }}></div>
              </div>
            </div>
            <div class="indicator-descr left">
              <p>Das Barometer zeigt Dir, wie herausfordernd Dein Alltag ist.</p><br/>
              <p>Je mehr Herausforderungen Du hast, desto höher steigt das Barometer.</p>
            </div>
          </section>

          <section>
            <div class="title">
              <span class="text-extra-bold">Deine Ergebnisse</span>
            </div>
            <div class="descr">
              (Top 3 Herausforderungen)
            </div>
            {
              this.state.topItems.map(({ question }, key) => (
                <div class="row clear" key={key}>
                  <div class="number left">{key + 1}</div>
                  <div class="info-block left">
                    <div class="title">
                      {question}
                    </div>
                  </div>
                </div>
              ))
            }
            <div class="question-block">
              Wenn Du Fragen oder Gesprächsbedarf hast, kontaktiere einfach Deinen Lernbegleiter im Messenger.
            </div>
            { !this.state.isPDF && button }
          </section>

        </div>
        { !this.state.isPDF && <Footer /> }
      </div>
    );
  }
}
