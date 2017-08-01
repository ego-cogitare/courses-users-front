import React from 'react';
import { Link } from 'react-router';

export default function QuizLink({ lectionId }) {
    return (
      <div class="quiz-link">
        <div class="container clear">
          <div class="left">
            <div class="descr-text text-bold">
              
            </div>
          </div>
          <div class="hexagon left">
            <div class="icon quiz-owl-icon"></div>
            <div class="title">
              <Link to={`/quiz/${lectionId}`}>Teste dein Wissen</Link>
            </div>
          </div>
        </div>
      </div>
    );
};
