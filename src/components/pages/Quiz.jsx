import React from 'react';
import { Link } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import '../../staticFiles/css/quiz.css';
import { list, get, finishQuiz } from '../../actions/Quiz';
import { getStoredData, setStoredData, updateStoredData } from '../../actions/User';

export default class Quiz extends React.Component {

  constructor(props) {
    super(props);

    this.initialState = {
      // Quiz information
      quiz: {},

      // Quiz questions list
      questions: [],

      // Current quiz of step
      quizCounter: 0,

      // Current quiz correct answers amount
      correctAnswers: 0,

      // Amount of given answers of the current quiz
      givenAnswers: 0,
    };

    this.state = Object.assign({}, this.initialState);

    // Correct answers stored config
    this.storedAnswers = null;
  }

  quizLoad() {
    this.setState(Object.assign({}, this.initialState));

    list({ courseId: this.props.params.courseId },
      (quiz) => {
        if (!quiz.id) {
          window.location.hash=`/course/${this.props.params.courseId}`;
          return;
        }
        this.setState({ quiz });

        // Load quiz questions list
        this.getQuestions(quiz.id);
      },
      (e) => console.error(e)
    );
  }

  componentWillMount() {
    this.quizLoad();
  }

  componentDidMount() {
    $(window).scrollTop(0);
  }

  getQuestions(quizId) {
    // Quiz questions list
    get({ quizId },
      (questions) => this.addAnswersObjects(questions),
      (e) => console.error(e)
    );
  }

  addAnswersObjects(questions) {
    questions.forEach((question) => {
      question.answers = question.answers.map(
        (answer, key) => ({
          text: answer,
          index: key + 1,
          customClass: '',
          checked: false
        })
      );
    });
    this.setState({ questions });

    // Get stored correct answers config
    getStoredData({ key: this.state.quiz.id },
      (r) => {
        try {
          // Try to parse stored config
          this.storedAnswers = JSON.parse(r.json);

          // Apply stored config
          questions.forEach((question) => {
            if (this.storedAnswers.hasOwnProperty(question.id)) {
              question.answers.forEach(
                (answer, key) => {
                  // Mark question answers as answered
                  Object.assign(answer, { checked: true });

                  // Set correct answer
                  if (answer.index === this.storedAnswers[question.id]) {
                    Object.assign(answer, { customClass: 'correct' });
                  }
                }
              );
            }
          });

          this.setState({
            questions,
            givenAnswers: Object.keys(this.storedAnswers).length,
            correctAnswers: Object.keys(this.storedAnswers).length,
          });
        }
        catch (e) {
          console.error('Error', e);
        }
      },
      (e) => console.error(e)
    );
  }

  answerClick(question, answer) {
    if (answer.checked) {
      return ;
    }

    const isCorrect = this.isAnswerCorrect(question, answer);

    // If answer is correct, save it state
    if (isCorrect) {
      console.log('Answer is correct, updating stored answers...');
      let data = Object.assign((this.storedAnswers || {}), {
        [question.id]: question.correct
      });
      (this.storedAnswers ? updateStoredData : setStoredData)(
        {
          key: question.quizId,
          json: JSON.stringify(data),
        },
        (r) => console.log('Answers updated') ,
        (e) => console.error('Updating answers error:', e)
      );

      this.storedAnswers = data;
    }

    // Update answer
    Object.assign(answer, {
      customClass: isCorrect ? 'correct' : 'incorrect',
      checked: true
    });

    question.answers.forEach((an) => {
      an.checked = true;
    });

    // Increase amount of given answers
    this.setState({ givenAnswers: this.state.givenAnswers + 1 }, () => {
      // Check if given answer is correct
      const isCorrect = this.isAnswerCorrect(question, answer);

      // If answer is correct then increase correct answer counter
      let countCourrect = isCorrect ? this.state.correctAnswers + 1 : this.state.correctAnswers;

      this.setState({ correctAnswers: countCourrect }, () => {
        if (this.state.questions.length === this.state.givenAnswers) {
          this.state.questions.forEach((question) => {
            question.answers.forEach((answer) => {
              if (answer.checked && answer.customClass) {
                  const isCorrect = this.isAnswerCorrect(question, answer);
                  answer.customClass = isCorrect ? 'correct' : 'incorrect';
              }
            });
          });
        }
        if (this.state.questions.length === this.state.correctAnswers) {
          finishQuiz({ quizId: this.state.quiz.id },
            (r) => console.log(r),
            (e) => console.eror(e)
          );
        }
        this.setState({ questions: this.state.questions });
      });
    });
  }

  isAnswerCorrect(quiz, answer) {
    return (quiz.correct === answer.index);
  }

  nextQuiz(e) {
    e.preventDefault();


    // Fixing code (we have user with answer all question but do not have "quiz finish marker")
    finishQuiz({ quizId: this.state.quiz.id },
      (r) => console.log(r),
      (e) => console.eror(e)
    );

    // Fetch next quiz
    this.quizLoad();
  }

  render() {
    return (
      <div class="wrapper quiz h100p">
        <Header />
        <div class="content">
          {
            /* Render on data loaded */
            this.state.quiz.id ?
              <div class="container">
                <div class="title">
                  <span class="text-extra-bold">{this.state.quiz.title}</span>
                </div>
                <div className="text">
                    <p>Willkommen im Quiz-Bereich. Hier hast Du die Möglichkeit, Dein Wissen zu dieser Lektion zu testen und Hinweise zu gewinnen, wo sich eine Iteration lohnen könnte. Um Deinen Lerneffekt zu optimieren, bekommst Du dein Feedback direkt zu jeder Frage. Die Lektion ist abgeschlossen, wenn Du alle Fragen richtig beantwortet hast.</p>
                </div>
                <div class="descr">Bitte beantworte folgende Quiz-Fragen:</div>
                {
                  this.state.questions.map((quiz, key) => (
                    <div class="question-container" key={quiz.id}>
                      <div class="question clear">
                        <div class="icon left type-owl"></div>
                        <div class="descr left">
                          <span class="text-bold">Frage #{key + 1}:</span> {quiz.question}
                        </div>
                      </div>
                      <div class="answers clear">
                        {
                          quiz.answers.map((answer, key) => (
                            <div class={'answer left '.concat(answer.customClass)}
                                 key={quiz.id + key}
                                 onClick={this.answerClick.bind(this, quiz, answer)}
                                 title={answer.text}
                            >
                              {answer.text}
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
                <div class="buttons-container clear">
                  {
                    /* Link to the next quiz: if question list is empty or all given answers are correct */
                    (this.state.questions.length === 0 || this.state.correctAnswers === this.state.questions.length) &&
                    <div class="hexagon left">
                      <div class="descr text-center">
                        <a href="#" onClick={this.nextQuiz.bind(this)}>
                          Super, Du<br />hast alles was du brauchst, um einen Schritt weiter zu gehen.
                        </a>
                      </div>
                    </div>
                  }
                  {/*
                  <div class="separator left text-center">
                    ODER
                  </div>
                  */}
                  {
                    /* If not all of the given answers are correct */
                    (this.state.givenAnswers === this.state.questions.length && this.state.correctAnswers < this.state.questions.length) &&
                    <div class="hexagon left">
                      <div class="descr text-center">
                        <Link to={`/course/${this.props.params.courseId}`}>
                          Schau doch<br />noch mal in die Inhalte. Du sollst ja letztendlich zum Pro werden!
                        </Link>
                      </div>
                    </div>
                  }
                </div>
              </div>
            :
              <div class="container text-center" style={{ paddingBottom: '50px', height: '500px' }}>
                  Quizliste leer <br/>
                  <Link to={`/course/${this.props.params.courseId}`}>
                      zurück zum Kurs
                </Link>
              </div>
          }
        </div>
        <Footer />
      </div>
    );
  }
}
