import React, { Component } from 'react';
import { Route }  from 'react-router';
import { Switch } from 'react-router-dom';
import API from 'API';
import Page from './App/Page';
import PriceChecker from './App/Pages/PriceCheck';
export default class extends Component {
  constructor() {
    super();
    this.host = 'http://localhost:3639';
    this.API = new API(this.host);
    console.log("Welcome to the DealerData demo!\n\nVisit our GitHub for source code:\nhttps://github.com/adom/dealerdata\n\nThanks!\n-Dan");
  }
  render() {
    return (
        <Page host={this.host} API={this.API} inheritedProps={{...this.props}} inheritedState={{...this.state}}>
          <Switch>
            <Route render={(props)=>{
                return <PriceChecker {...props} API={this.API} inheritedProps={{...this.props}} inheritedState={{...this.state}} />;
              }} />
          </Switch>
        </Page>
    );
  }
};
