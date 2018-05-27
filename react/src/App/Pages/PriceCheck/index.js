import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import './style.css';
import $ from 'jquery';

import FormatNumber from 'comma-number'; // akin to php's number_format()

export default class extends Component {
  constructor() {
    super();
    this.state = {
      makes: [],
      models: [],
      engines: [],
      priceMin: 0,
      priceAvg: 0,
      priceMax: 0,
      loading: false
    };
  }
  renderYears() {
    let rows = [];
    for(let i = 2006; i <= Number(new Date().getFullYear()); i++)
      rows.push(<option key={i} value={i}>{i}</option>);
    return rows;
  }
  renderMakes() {
    return this.state.makes.map(make => {
      if ( make === undefined )
        return false;
      return <option key={make} value={make}>{make}</option>
    });
  }
  renderModels() {
    return this.state.models.map(model => {
      if ( model === undefined )
        return false;
      return <option key={model} value={model}>{model}</option>
    });
  }
  renderEngines() {
    return this.state.engines.map(engine => {
      if ( engine === undefined )
        return false;
      return <option key={engine} value={engine}>{engine}</option>
    });
  }
  fetchFields(e) {
    // Determine the next field that needs to be populated
    // Once next field is determined, remove input from all
    // fields up to and after the next field, as we need to
    // repopulate subsequent fields again after a new selection

    // start with a blank object
    let formData = {};
    // specify the fields we'll be using
    let allFields = ['year', 'make', 'model', 'engine'];
    // get the current and next field name from the dropdown that was used to facilitate this change
    let selectedField = e.target.dataset.field === undefined ? false : e.target.dataset.field;
    let selectedFieldIndex = allFields.indexOf(selectedField);
    // increment current index and field by 1 for next field
    let nextFieldIndex = selectedFieldIndex + 1;
    let nextField = allFields.length > nextFieldIndex ? allFields[nextFieldIndex] : false;

    // build the formData object from any input fields previous to the next field
    for( let field of allFields ) {
      let currentIndex = allFields.indexOf(field);
      if ( currentIndex <= selectedFieldIndex ) {
        formData[field] = this.refs[field].value.trim();
      } else {
        // empty this state data so its select menu will disappear
        let stateObj = {};
        stateObj[field+'s'] = [];
        this.setState(stateObj);
      }
    }

    // initiate postData from formData but it may need the `get` field added
    let postData = {...formData};
    if ( nextField )
      postData['get'] = nextField;

    // Validation logging
    //console.log('Sending API request:', postData);

    // Fetch price and population for next field
    this.setState({loading: true});
    this.props.API.Fetch('/get/price/', postData)
    .then((dataObject) => {
      this.setState({loading: false});
      // Validation logging
      //console.log('Got API response:', dataObject);
      let stateObj = {
        priceMin: dataObject.min,
        priceAvg: dataObject.avg,
        priceMax: dataObject.max,
      };

      // store all form options (make, model, year, etc) in state
      let stateObjKey = nextField + 's';
      stateObj[stateObjKey] = dataObject.options.map(option => option);
      this.setState(stateObj);
    });
  }
  visualizerWidths() {
    let totalWidth = $('.PricePointVisualizer').innerWidth();
    if ( totalWidth === undefined )
      return {total: 0, min: 0, max: 0};

    totalWidth *= 0.85; // start with 85% of available real-estate
    totalWidth -= $('.PricePointVisualizer--Min').outerWidth();
    totalWidth -= $('.PricePointVisualizer--Avg').outerWidth();
    totalWidth -= $('.PricePointVisualizer--Max').outerWidth();

    let totalDeviation = Math.max(this.state.priceMax - this.state.priceMin, 1);
    let deviationToMin = (this.state.priceAvg - this.state.priceMin) / totalDeviation;
    let deviationToMax = (this.state.priceMax - this.state.priceAvg) / totalDeviation;

    return {
      total: totalWidth,
      min: totalWidth * deviationToMin,
      max: totalWidth * deviationToMax,
    };
  }
  containerClasses() {
    let classes = ['PriceChecker'];
    if ( this.state.loading )
      classes.push('loading');
    return classes;
  }
  render() {
    let visualizerWidths = this.visualizerWidths();
    return (
      <div className={this.containerClasses().join(' ')}>
        <div className="Loading">
          <div className="bounce-loader" >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="PricePointVisualizer">
          <div className="PricePointVisualizer--Min">
            <h5>${FormatNumber(this.state.priceMin)}</h5>
          </div>
          <div className="PricePointVisualizer--Dots" style={{width: visualizerWidths.min}} />
          <div className="PricePointVisualizer--Avg">
            <h5>${FormatNumber(this.state.priceAvg)}</h5>
          </div>
          <div className="PricePointVisualizer--Dots" style={{width: visualizerWidths.max}} />
          <div className="PricePointVisualizer--Max">
            <h5>${FormatNumber(this.state.priceMax)}</h5>
          </div>
        </div>
        <select onChange={this.fetchFields.bind(this)} data-field="year" ref="year">
          <option value="">Year</option>
          {
            this.renderYears()
          }
        </select>
        <select onChange={this.fetchFields.bind(this)} style={!this.state.makes.length?{display: 'none'}:{}} data-field="make" ref="make">
          <option value="">Make</option>
          {
            this.renderMakes()
          }
        </select>
        <select onChange={this.fetchFields.bind(this)} style={!this.state.models.length?{display: 'none'}:{}} data-field="model" ref="model">
          <option value="">Model</option>
          {
            this.renderModels()
          }
        </select>
        <select onChange={this.fetchFields.bind(this)} style={!this.state.engines.length?{display: 'none'}:{}} data-field="engine" ref="engine">
          <option value="">Engine</option>
          {
            this.renderEngines()
          }
        </select>
      </div>
    );
  }
};
