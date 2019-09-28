import React, { Component } from "react";

export default class ButtonComponent extends Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        onPress={() => this.props.onClick()}
      >
        <AppText style={this.props.style} i18nKey={this.props.i18nKey}/>
      </TouchableOpacity>
    );
  }
}
