import React from 'react';
import '../../../staticFiles/css/footer.css';

export default function Footer() {
  return (
    <div class="footer w100p">
      <div class="menu h100p clear">
        <a href="#" class="logo h100p left">
          <img src={require('../../../staticFiles/img/footer-logo.png')} width="46" alt="Logo" />
        </a>
        <div class="logo-descr left">
          Creative<br/>learning<br/>space
        </div>

        <div class="text-item left h100p">
          <a href="http://www.creativelearningspace.com/impressum-datenschutz/" target="_blank">IMPRESSUM</a>
        </div>
        <div class="text-item left h100p">
          <a href="http://www.creativelearningspace.com/impressum-datenschutz/#4" target="_blank">DATENSCHUTZ</a>
        </div>
        <div class="text-item left h100p">
          <a href="http://www.creativelearningspace.com/about/" target="_blank">ÜBER UNS</a>
        </div>
        {/*
        <div class="social-item right h100p">
          <a href="#">
            <i class="youtube h100p"></i>
          </a>
        </div>
        */}
        <div class="social-item right h100p">
          <a href="https://twitter.com/enjoycls?lang=de" target="_blank">
            <i class="twitter h100p"></i>
          </a>
        </div>
        <div class="social-item right h100p">
          <a href="https://www.facebook.com/Creativelearningspace/" target="_blank">
            <i class="facebook h100p"></i>
          </a>
        </div>
        <div class="social-item right h100p">
          <a href="https://www.instagram.com/enjoycls/" target="_blank">
            <i class="instagram h100p"></i>
          </a>
        </div>
        <div class="text-item right h100p">
          We are social:
        </div>
      </div>
    </div>
  );
};
