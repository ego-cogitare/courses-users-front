import React from 'react';
import { getStoredData, setStoredData, updateStoredData } from '../../../../../actions/User';

export default class Selfcheck extends React.Component {

  constructor(props) {
    super(props);

    this.SELECTED_OBJECT = 1;
    this.SELECTED_INDEXED = 2;

    this.percentsDefault = {
      lamp  : 0,
      darts : 0,
      chart : 0,
      human : 0,
    };

    try {
      this.state = {
        body: JSON.parse(this.props.step.body),
        percents: this.percentsDefault,
        storedData: null
      };
    }
    catch (e) {
      this.state = {
        body: [],
        percents: this.percentsDefault,
        storedData: null
      };
    }

    // Add checked attribute to the tag
    this.resetSelected();

    // Get stored data for the widget
    getStoredData({ key: this.props.step.id },
      (r) => {
        let storedData = [];
        try { storedData = JSON.parse(r.json); } catch (e) { }

        // Set checked attribute to true for tags
        this.setSelected(storedData);

        // Recalculate percents
        this.recalcPercents();

        // Rerender view
        this.setState({
          body: this.state.body,
          percents: this.state.percents,
          storedData
        });
      },
      (e) => console.error(e)
    );
  }

  resetSelected(rowId = -1) {
    this.state.body.forEach((row, currentRow) => {
      if (rowId > -1 && currentRow !== rowId) {
        return ;
      }
      row.forEach((tag) => {tag.checked = false;});
    });
  }

   isRowSelected(rowId = -1) {
    var selected = false;
    this.state.body.forEach((row, currentRow) => {
      if (rowId > -1 && currentRow !== rowId) {
        return ;
      }
      row.forEach((tag) => {
          if (tag.checked) selected = true;
      });
    });
    return selected;
  }

  /**
   * @param {type} type of selected tags to watch to (ex. lamp|darts|chart|human)
   * @param {returnResult} how to return result (as array of tag objects or an indexed array)
   * @return {Array}
   */
  getSelected(type = '', returnResult = this.SELECTED_OBJECT) {
    let selection = [];

    this.state.body.forEach((row, rowId) => {
      row.forEach((tag, tagId) => {
        if (tag.checked && (type === '' || type === tag.type)) {
          selection.push(returnResult === this.SELECTED_OBJECT ? tag : [rowId, tagId]);
        }
      });
    });
    return selection;
  }

  // Restore checked tags state from stored data
  setSelected(storedData) {
    storedData.forEach((point) => {
      const tag = this.state.body[point[0]][point[1]];
      if (typeof tag !== 'undefined') {
        tag.checked = true;
      }
    });
  }

  getTagsByType(type = '') {
    let tags = [];

    this.state.body.forEach((row) => {
      row.forEach((tag) => {
        if (type === '' || type === tag.type) {
          tags.push(tag);
        }
      });
    });
    return tags;
  }

  isAllRowSelected() {
    let selected = true;

    this.state.body.forEach((row, rowId) => {
      let selectedRow = false;
      row.forEach((tag) => {
        if (tag.checked) {
          selectedRow = true;
        }
      });
      if (selectedRow === false) {
        selected = false;
      }
    });

    return selected;
  }

  recalcPercents() {
    Object.keys(this.percentsDefault).forEach((type) => {
      const percent = Math.round(this.getSelected(type, this.SELECTED_OBJECT).length / (this.getTagsByType(type).length || 1) * 100);
      this.state.percents[type] = percent;
    });
  }

  onTagClick(rowId, tagId, tag, e) {
    e.preventDefault();

    // Check if answer already given on the question
    if (this.isRowSelected(rowId)) {
      return ;
    }

    // Uncheck all row tags
    this.resetSelected(rowId);

    // Inverse checked state
    tag.checked = !tag.checked;

    // Update percents
    this.recalcPercents();

    // Get selected tags
    let storedData = this.getSelected('', this.SELECTED_INDEXED);

    /*                 SAVE FUNCTION NAME                   */
    (this.state.storedData ? updateStoredData : setStoredData)({ key: this.props.step.id, json: JSON.stringify(storedData) },
      (r) => this.setState({
        body: this.state.body,
        percents: this.state.percents,
        storedData
      }),
      (e) => console.error(e)
    );
  }

  humanizeSectionType(section) {
    let sections = {
        lamp  : 'VISIONÄR',
        darts : 'MACHER',
        chart : 'ANALYTIKER',
        human : 'MODERATOR',
    };

    return sections[section];
  }

  get renderIcons() {
    return (
      <div>
          { !this.props.unshow &&
          <div class="title">
            Dein Ergebnis
          </div>
          }
        <div class="icons-wrapper">
        {
          Object.keys(this.percentsDefault).map((section, key) => (
            <div class="row" key={key}>
              <div class="clear">
                <div class="title left">
                  <span class="text-bold">{this.humanizeSectionType(section)}</span><br/>({this.state.percents[section]}%)
                </div>
                <div class={"icons right ".concat(section)}>
                  <div class="grayscale"></div>
                  <div class="colour" style={{width: this.state.percents[section] + '%'}}></div>
                </div>
              </div>
            </div>
          ))
        }
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="data">
        <div class="self-check-section">
          <div class="tags-wrapper">
            {
              !this.props.unshow && this.state.body.map((row, rowId) => (
                <div class="row" key={rowId}>
                  <ul class="tags">
                    {
                      row.map((tag, tagId) => (
                        <li key={tagId} onClick={this.onTagClick.bind(this, rowId, tagId, tag)}>
                          <a href="#" class={'tag text-bold'.concat(tag.checked ? ' checked' : '')}>{tag.title}</a>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))
            }
          </div>
          { this.state.storedData && this.isAllRowSelected() && this.renderIcons }
        </div>
      </div>
    );
  }
}
