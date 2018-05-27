import React, { Component } from 'react';
import ReactLogo from '__gfx__/logos/react.svg';
import './style.css';
import NewWindow from 'import/NewWindow';
export default class extends Component {
  render() {
    return (
      <div {...this.props.inheritedProps} id="top">
        <section className="header">
          <div>
            <img src={ReactLogo} className="logo" alt="ReactJS" />
            <div>
              <div style={{display: 'inline-block'}}>
                <h1>DealerData</h1>
                <h6 className="Adom"><NewWindow className="copyright" href="https://adom.co">by Adom</NewWindow></h6>
              </div>
            </div>
          </div>
        </section>
        <section>
          {this.props.children}
        </section>
        <section className="footer">
          <NewWindow href="https://github.com/adom/dealerdata"><i className="fa fa-github" /></NewWindow>
        </section>
      </div>
    );
  }
};
