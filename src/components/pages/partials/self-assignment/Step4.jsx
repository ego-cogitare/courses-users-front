import React from 'react';
import { hashHistory } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { getStoredData } from '../../../../actions/User';
import '../../../../staticFiles/css/self-assignment/step-2-3-4.css';

export default class Step4 extends React.Component {

  constructor(props) {
    super(props);

    this.state = { marks: [], prevStep: 'self-assignment/step-1', isPDF: props.isPDF };
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
          marks[4] = 5 - marks[4] + 1;
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
        S. 3/3
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
              <div class="number left">5</div>
              <div class="info-block left">
                <div class="title">
                  <span class="text-bold">Offenheit für neue Erfahrungen:</span> beschreibt das Ausmaß der Beschäftigungen mit neuen Eindrücken, Erfahrungen und Erlebnissen.
                </div>
                <div class="progressbar-wrapper">
                  <div class="progress-bar" style={{ width: this.percent(4, 9) + '%' }}></div>
                </div>
                <div class="clear">
                  <div class="left">
                    <i>Konventionell</i>
                    <i>Routiniert</i>
                    <i>Konservativ</i>
                    <i>Wettbewerbsorientiert</i>
                    <i>Etabliert</i>
                    <i>Vorsichtig</i>
                  </div>
                  <div class="right text-right">
                    <i>Fantasievoll</i>
                    <i>Wissensbegierig</i>
                    <i>Hilfsbereit</i>
                    <i>Interessiert</i>
                    <i>Experimentierfreudig</i>
                    <i>Unkonventionell</i>
                    <i>Innovationsorientiert</i>
                    <i>Erfinderisch</i>
                  </div>
                </div>
              </div>
            </div>
            <div class="question-block">
              Wenn Du Fragen oder Gesprächsbedarf hast, kontaktiere einfach Deinen Lernbegleiter im Messenger.
            </div>
            { !this.state.isPDF && pageNum }
          </section>
        </div>
        { !this.state.isPDF && <Footer /> }
      </div>
    );
  }
}
