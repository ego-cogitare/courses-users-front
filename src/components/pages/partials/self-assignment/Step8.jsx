import React from 'react';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import { updateStoredData, setStoredData, getStoredData } from '../../../../actions/User';
import '../../../../staticFiles/css/self-assignment/step-8.css';

export default class Step8 extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      goals: ['', '', '', '', '', '', '', '', '', ''],
      visitMode: null,
      configChecked: false
    };
  }

  componentWillMount() {
    // Try to get stored config
    getStoredData({ key: 'goals' },
      (r) => {
        console.log(r);
        try {
          this.setState({
            goals: JSON.parse(r.json),
            visitMode: 'back',
            configChecked: true
          }, () => {
            // Add missed goals (should be 10)
            for (let i = this.state.goals.length; i < 10; i++) {
              this.state.goals.push('');
            }
            this.setState({ goals: this.state.goals });

            // Save/update stored config to local storage
            localStorage.setItem(r.key, JSON.stringify(this.state.goals));
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

    let data = {
      key : 'goals',
      json: JSON.stringify([
        this.refs.goal1.value,
        this.refs.goal2.value,
        this.refs.goal3.value,
        this.refs.goal4.value,
        this.refs.goal5.value,
        this.refs.goal6.value,
        this.refs.goal7.value,
        this.refs.goal8.value,
        this.refs.goal9.value,
        this.refs.goal10.value
      ])
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

  onChange(key, e) {
    let text = e.target.value
    this.setState((prev) => {
      prev.goals[key] = text;

      console.log(prev.goals);
      return {
        goals: prev.goals
      }
    });
  }

  render() {
    return (
      <div class="wrapper self-assignment step-8">
          <div class="heads-bg"></div>
          <div class="tablet-bg"></div>
          <div class="content">
            <Header />
            <section>
              <div class="title">
                Deine Lernziele
              </div>
              <div class="descr">
                Definiere mindestens drei Lernziele. Sei dabei besonders SMART.  Also spezifisch, messbar, ambitioniert, realistisch und terminiert.
              </div>
              {
                this.state.goals.map((goal, key) => (
                  <div class="row clear" key={key}>
                    <div class="number left">{key + 1}</div>
                    <div class="info-block left">
                      <textarea
                        class="write-here"
                        ref={'goal'.concat(key + 1)}
                        placeholder="Dein Lernziel eingeben..."
                        value={ goal }
                        onChange={ this.onChange.bind(this, key) }
                      ></textarea>
                    </div>
                  </div>
                ))
              }
              <div class="clear weiter">
                <div class="btn right" onClick={this.nextStepHandler.bind(this)}>WEITER</div>
              </div>
            </section>
          </div>
          <Footer />
      </div>
    );
  }
}
