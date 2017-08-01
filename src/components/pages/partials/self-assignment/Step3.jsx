import React from 'react';
import { hashHistory } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { getStoredData } from '../../../../actions/User';
import '../../../../staticFiles/css/self-assignment/step-2-3-4.css';

export default class Step3 extends React.Component {

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
          marks[2] = 5 - marks[2] + 1;
          marks[3] = 5 - marks[3] + 1;
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
        S. 2/3
      </div>
    </span>


    return (
      <div class="wrapper self-assignment step-2">
        <div class="heads-bg"></div>
        <div class="tablet-bg"></div>
        <div class="content h100p">
          <Header />

          <section>
            <div class="row clear">
              <div class="number left">3</div>
              <div class="info-block left">
                <div class="title">
                  <span class="text-bold">Gewissenhaftigkeit:</span> beschreibt den Grad der Selbstkontrolle, Unabhängigkeit und Zielstrebigkeit
                </div>
                <div class="progressbar-wrapper">
                  <div class="progress-bar" style={{ width: this.percent(2, 7) + '%' }}></div>
                </div>
                <div class="clear">
                  <div class="left">
                    <i>Spontan</i>
                    <i>Ungenau</i>
                    <i>Pragmatisch</i>
                    <i>Unbekümmert</i>
                  </div>
                  <div class="right text-right">
                    <i>organisiert</i>
                    <i>planend</i>
                    <i>verantwortlich</i>
                    <i>Überlegt</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="row clear">
              <div class="number left">4</div>
              <div class="info-block left">
                <div class="title">
                  <span class="text-bold">Neurotizismus:</span> Spiegelt individuelle Unterschiede im Erleben von negativen Emotionen wider. Der Gegenpol wird als emotionale Stabilität bezeichnet.
                </div>
                <div class="progressbar-wrapper">
                  <div class="progress-bar" style={{ width: this.percent(3, 8) + '%' }}></div>
                </div>
                <div class="clear">
                  <div class="left">
                    <i>Selbstsicher</i>
                    <i>Ruhig</i>
                    <i>Entspannt</i>
                  </div>
                  <div class="right text-right">
                    <i>Emotional</i>
                    <i>Verletzlich</i>
                    <i>Irrational</i>
                    <i>Stressanfällig</i>
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
