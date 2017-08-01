import React from 'react';
import User from '../../../core/helpers/User';
import { list, add, update } from '../../../actions/Keylearning';

export default class Keylearnings extends React.Component {

  constructor(props) {
    super(props);

    // Maximum keylearning text length
    const MAX_LENGTH = 140;

    this.state = {
      maxLength: MAX_LENGTH,
      charsLeft: MAX_LENGTH,
      text: (this.props.step.keylearning || {}).text,
      savingProgress: false
    };
  }

  onSave(e) {
    this.setState({ savingProgress: true });

    const data = {
      lectionId: this.props.lectionId,
      stepId: this.props.step.step.id,
      userId: User.data.id,
      text: this.state.text
    };

    // Update existing keylearning
    if (this.props.step.keylearning) {
      update({ ...data, id: this.props.step.keylearning.id },
        (r) => this.setState({ savingProgress: false }),
        (e) => console.error(e)
      );
    }
    // Add first keylearning
    else {
      add({ ...data },
        (r) => this.setState({ savingProgress: false }),
        (e) => console.error(e)
      );
    }
  }

  onChangeHandle(e) {
    this.setState({
      charsLeft: this.state.maxLength - e.target.value.length,
      text: e.target.value
    });
  }

  render() {
    return this.props.step.step.keylearningEnabled ? (
      <div
        id={'keylearning-' + this.props.step.step.id}
        class={"keylearnings".concat(this.state.savingProgress ? " loading" : "")}
      >
        <div class="title">
          Keylearnings
        </div>
        <textarea
          placeholder="Schreibe hier, was Du gelernt hast..."
          class="keylearnings-editor"
          ref="message"
          maxLength={this.state.maxLength}
          onChange={this.onChangeHandle.bind(this)}
          defaultValue={(this.props.step.keylearning || {}).text}
        />
        <i class="spinner fa fa-refresh fa-spin fa-3x fa-fw"></i>
        <div class="message-limitations">Noch {this.state.charsLeft} Zeichen!</div>
        <div class="keylearnings-button text-center" onClick={this.onSave.bind(this)}>
          SPEICHERN
        </div>
      </div>
    ) : null;
  }
}
