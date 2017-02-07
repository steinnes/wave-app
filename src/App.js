import React, { Component } from 'react';
import ToggleButton from 'react-toggle-button'
import './App.css';
import Wave from './Wave.js';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      animate: false,
    };
  }

  componentWillMount() {
    window.addEventListener("resize", () => {this.setWindowSize()});
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () => {this.setWindowSize()});
  }
  componentDidMount() {
    this.setWindowSize();
  }

  setWindowSize(width, height) {
    this.setState({
      ...this.state,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  }

  playPause(value) {
    this.setState({
      ...this.state,
      animate: value,
    });
  }

  render() {
    console.log("App.render..", this.state);
    return (
      <div className="App">
        <div className="Wave">
          <Wave
            id="wave"
            width={this.state.windowWidth}
            height={this.state.windowHeight - 100}
            animate={this.state.animate}
          />
        </div>
        <div className="Controls">
          <ToggleButton
            value={this.state.animate}
            onToggle={(value) => {this.playPause(!value)}}
          />
        </div>
      </div>
    );
  }
}
