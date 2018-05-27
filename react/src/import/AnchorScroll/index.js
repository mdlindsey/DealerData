import React, { Component } from 'react';
import ScrollTo from 'scroll-to-selector';
import $ from 'jquery';

// not used in this project as of now, but left for future implementations

export default class extends Component {
  constructor() {
    super();
    this.config = {
      offset: $(window).height() * 0.4,
      duration: 800,
      showHash: true
    };
  }
  scrollTo(e) {
    e.preventDefault();
    ScrollTo(this.props.href, this.config.offset, this.config.duration, this.props.callback);
  }
  render() {
    return (
      <span style={{cursor: 'pointer'}} onClick={this.scrollTo.bind(this)}>{this.props.children}</span>
    );
  }
};
