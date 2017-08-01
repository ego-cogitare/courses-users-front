import React from 'react';
import { Link } from 'react-router';
import Header from './partials/Header.jsx';
import Footer from './partials/Footer.jsx';
import '../../staticFiles/css/quiz.css';
import { get, list, getQuizById} from '../../actions/Quiz';

export default class QuizPreview extends React.Component {

    constructor(props) {
        super(props);

        this.state = { questions: [], quiz: {} }
    }

    componentDidMount() {


        $(window).scrollTop(0); 

       let lectionId = this.props.params.lectionId;
       let quizId = this.props.params.quizId;

        list({
            courseId: lectionId
        }, (r) => {

            if (r.id) {
                location.hash = "#/";
                return;
            }

            getQuizById(quizId, (r) => {
                this.setState({
                    quiz: r
                });
            });

            get({ quizId: quizId },
                (questions) => {
                    this.setState({
                        questions: questions
                    });
                },
                (e) => console.error(e)
            );

        });
    }

    render() {
        return (
            <div class="wrapper quiz h100p">
                <Header />
                <div class="content">
                    {
                        /* Render on data loaded */
                        this.state.quiz.id &&
                            <div class="container">
                                <div class="title">
                                    <span class="text-extra-bold">{this.state.quiz.title}</span>
                                </div>
                                <div class="descr">Bitte beantworte folgende Quiz-Fragen:</div>
                                {
                                    this.state.questions.map((question, key) => (
                                        <div class="question-container" key={question.id}>
                                            <div class="question clear">
                                                <div class="icon left type-owl"></div>
                                                <div class="descr left">
                                                    <span class="text-bold">Frage #{key + 1}:</span> {question.question}
                                                </div>
                                            </div>
                                            <div class="answers clear">
                                                {
                                                    question.answers.map((answer, key) => (
                                                        <div class={'answer left ' + (question.correct === key + 1 ? 'correct' : '')}
                                                             key={question.id + key}
                                                             title={answer}
                                                        >
                                                            {answer}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }

                            </div>
                    }
                </div>
                <Footer />
            </div>
        );
    }
}
