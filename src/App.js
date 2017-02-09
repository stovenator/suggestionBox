import React, { Component } from 'react';
import { Grid, Navbar, Jumbotron, Button, FormGroup, FormControl, ControlLabel, Radio } from 'react-bootstrap';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      suggestion: '',
      makesMoney: 0,
      explanation: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleExplainChange = this.handleExplainChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
  }
  getInitialState() {
    return {
      suggestion: '',
      makesMoney: 0,
      explanation: '',
    };
  }

  getValidationState() {
    if (this.state.makesMoney === 2 ) return 'success';
    else if (this.state.makesMoney === 1 ) return 'success';
    else if (this.state.makesMoney === 0 ) return 'error';
    else return 'error';
  }

  handleChange(e) {
    this.setState({ suggestion: e.target.value });
  }
  handleRadioChange(e){
    this.setState({makesMoney: parseInt(e.target.value, 10)})
  }
  handleExplainChange(e){
    this.setState({explanation: e.target.value})
  }
  render() {
    return (
      <div>
        <Navbar inverse fixedTop>
          <Grid>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">GLG Suggestion Box</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
          </Grid>
        </Navbar>
        <Jumbotron>
          <Grid>
            <h1>Suggestion Box</h1>
          </Grid>
        </Jumbotron>
        <Grid>
         <form>
          <FormGroup controlId="formBasicText" validationState={this.getValidationState()} >
            <ControlLabel>Your Suggestion:</ControlLabel>
            <FormControl
              type="text"
              value={this.state.suggestion}
              placeholder="Suggestion"
              onChange={this.handleChange}
            />
          </FormGroup>
           <FormGroup onChange={this.handleRadioChange} >
              <Radio inline name='radioGroup' value='1'>
                Makes Money
              </Radio>
              <Radio inline name='radioGroup' value='2'>
                Saves Money
              </Radio>
              <Radio inline name='radioGroup' value='0'>
                Other
              </Radio>
          </FormGroup>
          <FormGroup controlId="explain" validationState={this.getValidationState()} className={this.state.makesMoney === 0 ? 'hide' : ''}>
            <ControlLabel>Explain how this will {this.state.makesMoney === 2 ? 'save' : 'make'} the company money:</ControlLabel>
            <FormControl
              type="text"
              value={this.state.explanation}
              placeholder="Explanation"
              onChange={this.handleExplainChange}
            />
          </FormGroup>
            <p>
              <Button
                bsStyle="primary"
                bsSize="large"
                href="#"
                disabled={this.state.makesMoney < 1}
                target="_blank">
                Submit 
              </Button>
            </p>
        </form>
        </Grid>
      </div>
    );
  }
}

export default App;
