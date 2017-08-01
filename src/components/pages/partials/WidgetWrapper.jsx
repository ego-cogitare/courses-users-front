import React from 'react';
import Widgets from './widgets';

export default class WidgetWrapper extends React.Component {

  render() {
    let widgets = {
        INFOGRAPHIC    : <Widgets.Infographic  step={this.props.step} />,
        VIDEO          : <Widgets.Video       step={this.props.step} />,
        PRACTICAL_PART : <Widgets.Practise    step={this.props.step} />,
        TOOLBOX        : <Widgets.Toolbox     step={this.props.step} />,
        SELFCHECK      : <Widgets.Selfcheck {...this.props} />,
    };
    return widgets[this.props.step.type] || <Widgets.Html step={this.props.step} />;
  }
}
