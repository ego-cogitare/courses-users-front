import React from 'react';
import Lightbox from 'react-image-lightbox';

export default class Infographic extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  render() {
    // Get picture src
    const src = this.props.step.body;

    return (
      <div>
        <span class="infographic">
          <img src={src} width="100%" alt="" />
        </span>
        <span class="inlarge">
          <img src={require('../../../../../staticFiles/img/infographic-inlarge.png')} width="100%" onClick={() => this.setState({ isOpen: true })} alt="" />
        </span>
        {this.state.isOpen && <Lightbox mainSrc={src} onCloseRequest={() => this.setState({ isOpen: false })} />}
      </div>
    );
  }
}
