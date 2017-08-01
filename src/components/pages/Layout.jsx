import React from 'react';
import '../../staticFiles/css/reset.css';
import '../../staticFiles/css/fonts.css';
import '../../staticFiles/css/custom.css';

export default class Layout extends React.Component {

  render () {
    return (
      <div>
        { this.props.children }
      </div>
    );
  }
}
