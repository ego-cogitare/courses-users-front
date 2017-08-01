import React from 'react';
import { hashHistory } from 'react-router';
import '../../../../staticFiles/css/self-assignment/step-2-3-4.css';
import { getStoredData } from '../../../../actions/User';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';

export default class Step2 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      marks: [],
      prevStep: 'self-assignment/step-1',
      isPDF: props.isPDF
    };
  }

  componentDidMount() {
    // Try to get stored config
    getStoredData({ key: 'questions' },
      (r) => {
        try {
          let marks = [];
          JSON.parse(r.json).forEach(({ mark }) => {
            marks.push(mark);
          });

          // Invert values
          marks[0] = 5 - marks[0] + 1;
          marks[6] = 5 - marks[6] + 1;
          this.setState({ marks }, function() {
            if (typeof window.callPhantom === 'function') {
              window.callPhantom({ func: 'loaded' });
            }
          });
        }
        catch (e) {
          console.error(e);
          hashHistory.push(this.state.prevStep);
        }
      },
      (e) => {
        hashHistory.push(this.state.prevStep);
        console.error(e);
      }
    )
    .always(
      () => setTimeout(() => window.scrollTo(0, 0), 100)
    );
  }

  percent(i, j) {
    return (((this.state.marks[i] + this.state.marks[j]) / 2.0) / 5.0) * 100;
  }

  nextStepHandler(e) {
    e.preventDefault();
    this.props.onNextStepClick();
  }

  render() {
    let pageNum = <span>
      <div class="navigation clear">
        <div class="right btn text-bold" onClick={this.nextStepHandler.bind(this)}>WEITER</div>
      </div>
      <div class="text-center step-page">
        S. 1/3
      </div>
    </span>;

    return (
      <div class="wrapper self-assignment step-2">
        <div class="heads-bg"></div>
        <div class="tablet-bg"></div>
        <div class="content h100p">
          <Header />

          <section>
            <div class="title">
              <span class="text-extra-bold">Deine Ergebnisse</span>
            </div>
            <div class="descr">
              Mit dem Personality Check erfassen wir die fünf Grunddimensionen der menschlichen Persönlichkeit.
            </div>

            <div class="row clear">
              <div class="number left">1</div>
              <div class="info-block left">
                <div class="title">
                  <span class="text-bold">Extraversion:</span> beschreibt Aktivität und zwischenmenschliches Verhalten. Wir unterscheiden zwischen Extraversion und Introversion.
                </div>
                <div class="progressbar-wrapper">
                  <div class="progress-bar" style={{ width: this.percent(0, 5) + '%' }}></div>
                </div>
                <div class="clear">
                  <div class="left">
                    <i>Zurückhaltend</i>
                    <i>Unabhängig</i>
                    <i>Aktivität alleine</i>
                  </div>
                  <div class="right text-right">
                    <i>Gesellig</i>
                    <i>Personenzentriert</i>
                    <i>Optimistisch</i>
                    <i>Empfänglich für Anregungen</i>
                  </div>
                </div>
              </div>
            </div>

            <div class="row clear">
              <div class="number left">2</div>
              <div class="info-block left">
                <div class="title">
                  <span class="text-bold">Verträglichkeit:</span> beschreibt interpersonelles Verhalten.
                </div>
                <div class="progressbar-wrapper">
                  <div class="progress-bar" style={{ width: this.percent(1, 6) + '%' }}></div>
                </div>
                <div class="clear">
                  <div class="left">
                    <i>Konfliktorientiert</i>
                    <i>Misstrauisch</i>
                    <i>Egozentrisch</i>
                    <i>Wettbewerbsorientiert</i>
                  </div>
                  <div class="right text-right">
                    <i>Altruistisch</i>
                    <i>Mitfühlend</i>
                    <i>Hilfsbereit</i>
                    <i>Verständnisvoll</i>
                    <i>Kooperativ</i>
                  </div>
                </div>
              </div>
            </div>
            { !this.state.isPDF && pageNum }
          </section>
        </div>
        { !this.state.isPDF && <Footer /> }
      </div>
    );
  }
}
