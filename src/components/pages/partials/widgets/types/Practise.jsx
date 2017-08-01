import React from 'react';

export default class Practise extends React.Component {

  constructor(props) {
    super(props);

    try {
      this.state = { body: JSON.parse(this.props.step.body) };
    }
    catch (e) {
      this.state = { body: null };
    }
  }

  onHexagonClick(item) {
    location.href = item.file;
  }

  render() {
    return (
      <div class="data">
        {
          this.state.body.map((section, sectionId) => (
            <div class="hexagons-section clear" key={sectionId}>
              {
                section.columns.map((column, columnId) => (
                  <div class="hexagon-column left" key={columnId}>
                    {
                      column.map((item, itemId) => (
                        <div class={"hexagon ".concat(item.className)} key={itemId} onClick={this.onHexagonClick.bind(this, item)}>
                          <div class={"icon ".concat(item.icon)}></div>
                          <div class="title">{item.title}</div>
                        </div>
                      ))
                    }
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
}
