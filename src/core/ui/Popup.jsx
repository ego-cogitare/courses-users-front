import React from 'react';
import '../../staticFiles/css/Popup.css';

export default class Popup extends React.Component {

  get initialState() {
    return {
      title: '',
      type: 'default',
      display: 'none',
      body: function() {
        return null;
      }
    };
  }

  constructor(props) {
    super(props);
    this.state = this.initialState;
  }

  show(payload) {
    this.setState({ ...payload, display: 'block' });
  }

  close() {
    $(this.refs.popup).fadeOut(500, () => this.setState(this.initialState));
  }

  render() {
    const style = this.state.body.props ? this.state.body.props.style : {};
    return (
      <div class={"popup-container modal modal-" + this.state.type} style={{ display: this.state.display }} ref="popup">
        <div class="modal-dialog" style={ style }>
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" onClick={this.close.bind(this)}>
                <span>×</span>
              </button>
              <h4 class="modal-title">{this.state.title}</h4>
            </div>
            {this.state.body}
          </div>
        </div>
      </div>
    );
  }
}
