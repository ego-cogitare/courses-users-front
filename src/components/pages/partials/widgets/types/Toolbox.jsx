import React from 'react';

export default class Toolbox extends React.Component {

  constructor(props) {
    super(props);

    try {
      this.state = { body: JSON.parse(this.props.step.body) };
    }
    catch (e) {
      this.state = { body: null };
    }
  }

  onRectangleClick(item) {
    location.href = item.file;
  }

  render() {
    return (
      <div class="data">
        <div class="squares-section text-center">
          {
            this.state.body.map((row, rowId) => (
              <div class="square-row" key={rowId}>
                {
                  row.columns.map((item, itemId) => (
                    <div class="square-column" key={itemId}>
                      <div class="square" onClick={this.onRectangleClick.bind(this, item)}>
                        <div class="icon" style={{backgroundImage: `url('${item.icon}')`}}></div>
                        <div class="descr">{item.title}</div>
                      </div>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
