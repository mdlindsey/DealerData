import React, { Component } from 'react';

export default class extends Component {
  render() {
    return (
      <a className={this.props.inheritColor ? 'inherit' : '' + this.props.className} target="_blank" rel="noopener noreferrer" href={this.props.href}>{this.props.text}{this.props.children}</a>
    );
  }
};
