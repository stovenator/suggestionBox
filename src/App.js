import React, { Component } from 'react';
import { Grid, Navbar, Nav, NavItem, Jumbotron, Button, FormGroup, FormControl, ControlLabel, Radio , Badge, Modal, Glyphicon} from 'react-bootstrap';
import fetchData from './fetchData';
import './App.css';
import _ from 'lodash';


class Header extends Component {
  render(){
    return(
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
    );
  }
}

class JTron extends Component {
  render(){
    return(
        <Jumbotron>
          <Grid>
            <h1>Suggestion Box</h1>
          </Grid>
        </Jumbotron>
    );
  }
}

class AddNewSuggestion extends Component {
  constructor(props){
    super(props);
    this.state = {
      suggestion: '',
      makesMoney: 0,
      explanation: '',
      labels: [],
      selectedLabels: [],
      showModal: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleExplainChange = this.handleExplainChange.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.createSuggestion = this.createSuggestion.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.setLabels = this.setLabels.bind(this);
    this.selectLabel = this.selectLabel.bind(this);
  }
  getInitialState() {
    return {
      suggestion: '',
      makesMoney: 0,
      explanation: '',
    };
  }

  getValidationState(inType) {
    var myLength = 0;
    if (inType === 'suggestion' && this.state.suggestion.length > 10){
      myLength = 1;
    }
    if (inType === 'explanation' && this.state.explanation.length > 10){
      myLength = 1;
    }
    if (inType === 'both' && this.state.suggestion.length > 10 && this.state.explanation.length > 10){
      myLength = 1;
    }
    if (myLength === 0) return 'error'
    return 'success';
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
  createSuggestion(e){
    e.preventDefault();
    fetchData.post('create',{body: this.state.explanation, title: this.state.suggestion, labels: this.state.selectedLabels})
    .then(results => {
      this.setState({
        suggestion: '',
        makesMoney: 0,
        explanation: '',
        selectedLabels: [],
        showModal: false,
      });
      this.openModal();
    })
  }
  closeModal() {
    this.setState({ showModal: false });
  }
  openModal() {
    this.setState({ showModal: true });
  }
  setLabels(labels){
    this.setState({
      labels: labels,
    })
  }
  selectLabel(e){
    var newLabel = e.target.value;
    var mySelected = this.state.selectedLabels;
    var indexNum = this.state.selectedLabels.indexOf(e.target.value);

    if (indexNum >= 0){
      mySelected.splice(indexNum, 1)
    }
    else{
      mySelected.push(newLabel);
    }
    this.setState({
      selectedLabels: mySelected,
    })
  }

  render(){
    var myControlLabel = ()=> { 
      if (this.state.makesMoney === 0){
        return(<ControlLabel>Explain why this is beneficial to GLG, when it does not make or save the company money.</ControlLabel>)
      }
      else{
        return(<ControlLabel>Explain how this will {this.state.makesMoney === 2 ? 'save' : 'make'} the company money:</ControlLabel>)
      }
    };
    return(
         <form>
          <ControlLabel>Your Suggestion:</ControlLabel>
          <FormGroup controlId="formBasicText" validationState={this.getValidationState('suggestion')} >
            <FormControl
              type="text"
              value={this.state.suggestion}
              placeholder="Suggestion"
              onChange={this.handleChange}
            />
          </FormGroup>
          <ControlLabel>Benefit to GLG:</ControlLabel>
          <FormGroup >
              <Radio inline name='radioGroup' value='1' checked={this.state.makesMoney === 1}  onChange={this.handleRadioChange}>
                Makes Money
              </Radio>
              <Radio inline name='radioGroup' value='2' checked={this.state.makesMoney === 2}  onChange={this.handleRadioChange}>
                Saves Money
              </Radio>
              <Radio inline name='radioGroup' value='0' checked={this.state.makesMoney === 0}  onChange={this.handleRadioChange}>
                Other
              </Radio>
          </FormGroup>
          {myControlLabel()}
          <FormGroup controlId="explain" validationState={this.getValidationState('explanation')} >
            <FormControl
              componentClass="textarea"
              value={this.state.explanation}
              placeholder="Explanation"
              onChange={this.handleExplainChange}
            />
          </FormGroup>
          <div>
            <LabelBlock labels={this.state.labels} selectedLabels={this.state.selectedLabels} setLabels={this.setLabels} selectLabel={this.selectLabel} />
            
            <p>
              <Button
                bsStyle="primary"
                bsSize="large"
                disabled={this.getValidationState('both') === 'error' }
                onClick={this.createSuggestion}
                target="_blank">
                Submit 
              </Button>
            </p>
            </div>
            <ModalBlock closeModal={this.closeModal} showModal={this.state.showModal} />
        </form>
    );
  }
}


class LabelBlock extends Component {
  constructor(props){
    super(props);
    this.state = {
      test: props.labels
    }
  }
  getLabels(){
    fetchData.get('labels')
    .then(results => {
      this.props.setLabels(results)
    })
  }
  componentDidMount(){
    this.getLabels();
  }
  render(){
    var labelButtons = this.props.labels.map((item, i) => {
        var selected = this.props.selectedLabels.indexOf(item.name) >= 0;
        return(
          <div key={i} className='label-container'>
            <Button bsStyle={selected ? 'success' : 'default'} bsSize='large' className={selected ? 'none' : 'go-right' } onClick={this.props.selectLabel} value={item.name}>{item.name}</Button>
          </div>
        )
      })
    return(
      <grid> 
        <ControlLabel>Apply Labels</ControlLabel>
        <p> Pick any labels that apply to this suggestion.</p>
        <div className='box'>
          {labelButtons}
        </div>
      </grid>
    )
  }

}

class ModalBlock extends Component {
  render(){
    return(
         <Modal show={this.props.showModal} onHide={this.props.closeModal}>
          <Modal.Body>
            <h4>New Suggestion Added</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.closeModal}>Close</Button>
          </Modal.Footer>
        </Modal>
    )
  }

}

class VoteButton extends Component {
  constructor(props){
    super(props);
    this.voteForIssue = this.voteForIssue.bind(this);
  }
  voteForIssue(issueNum){
    this.props.voteForIssue(issueNum);
  } 
  render(){
    let button = null;
    if (this.props.itemInfo.voted === 0){
      button = <Button bsStyle="primary" className="pull-right" onClick={this.voteForIssue.bind(this, this.props.itemInfo.number)} >Vote <Badge><Glyphicon glyph='plus-sign' /> {this.props.voteCount}</Badge></Button>
    }
    else {
      button = <Button bsStyle="primary" className="pull-right"><Badge><Glyphicon glyph='ok' /> {this.props.voteCount}</Badge></Button>
    }
    return(
      <div>
      {button}
      </div>
    )
  }
}

class ViewAll extends Component {
  constructor(props){
    super(props);
    this.state ={
      myVal : '',
      allSuggestions: []
    }
  }
  getAllSuggestions(){
    fetchData.get('all')
      .then(results =>  {
        if (results && results.length ) {
          var sorted = _.orderBy(results, ['voteTotal', 'number'], ['desc', 'asc']);
          this.setState({
            allSuggestions: sorted,
          })
        }
      });
  }
  openInGithub(url){
    var win = window.open(url, '_blank');
    win.focus();
  }
  voteForIssue(issueNum){
    fetchData.post('vote',{number: issueNum});
    var myData = _.cloneDeep(this.state.allSuggestions);
    var indexNum = _.findIndex(myData, {number: issueNum});
    myData[indexNum].voteTotal += 1;
    myData[indexNum].voted = 1;
    this.setState({
      allSuggestions: myData,
    })
  }
  componentDidMount(){
    this.getAllSuggestions();
  }

  render(){
    var displaySuggestions = this.state.allSuggestions.map((item)=> {
      var title = item.title;
      var url = item.html_url;
      var body = item.body.split('\n').map((bodyItem, index) => {
        return(index===0 ? bodyItem : [<br />, bodyItem]);
      });
      var voteCount = item.voteTotal;
      return (
          <div className='panel panel-primary' key={item.number}> 
            <div className='panel-heading'><a className='white-text' href={url} target='_blank'>{title}</a></div>
            <div className='panel-body'>
              <VoteButton itemInfo={item} voteForIssue={this.voteForIssue.bind(this)} voteCount={voteCount}/>
              {body}
              </div>
          </div>
      )
    })
    return(
      <div>
        {displaySuggestions}
      </div>
    )
  }
}

function bodyContent(viewState){
  if (parseInt(viewState,10) === 1){
    return <AddNewSuggestion />
  }
  else{
    return <ViewAll />
  }

}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      viewState: 1
    }
    this.handleTabSelect = this.handleTabSelect.bind(this);
  }
  handleTabSelect(e){
    this.setState({
      viewState: e,
    })
  }
  render() {
    return (
      <div>
        <Header />
        <JTron />
        <Grid>
          <Nav bsStyle="tabs" activeKey={this.state.viewState} onSelect={this.handleTabSelect}>
            <NavItem eventKey={1} value={1}>Add A Suggestion</NavItem>
            <NavItem eventKey={2} value={2}>See all Suggestions</NavItem>
          </Nav>
          {bodyContent(this.state.viewState)}
        </Grid>
        <Grid>
         
        </Grid>
      </div>
    );
  }
}

export default App;
