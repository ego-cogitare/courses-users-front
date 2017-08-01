import React from 'react';
import '../../../../../staticFiles/css/self-assignment/partials/header.css';

export default class Header extends React.Component {

  render() {
    return (
      <header class="clear w100p">
        <div class="logo-wrapper left clear">
          <div class="logo left">
            <a href="#">
              <img src={require('../../../../../staticFiles/img/self-assignment/step-2-3-4/logo.png')} alt="Logo" />
            </a>
          </div>
          <div class="text left">
            Creative
            learning
            space
          </div>
        </div>
        {/*<div class="pers-check text-center right">Personality Check</div>*/}
      </header>
    );
  }
}
