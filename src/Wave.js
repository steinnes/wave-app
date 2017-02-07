import React, { Component } from 'react';

export default class Wave extends Component {
  constructor(props) {
    super(props);
    this.state = {ready: false};
  }
  componentDidMount() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    navigator.getUserMedia (
      {
        // constraints - only audio needed for this app
        audio: true
      },

      // Success callback
      (stream) => {
        var source = this.audioCtx.createMediaStreamSource(stream);
        console.log(source);
        console.log(this);
        console.log(this.analyser);
        source.connect(this.analyser);
        this.setState({...this.state, ready: true});
      },

      // Error callback
      (err) => {
        console.log('The following gUM error occured: ' + err);
      }
    );
  }
  visualize() {
    this.analyser.fftSize = 2048;
    var canvas = document.getElementById(this.props.id);
    var canvasCtx = canvas.getContext("2d");
    var bufferLength = this.analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    console.log("visualizing..");
    let draw = () => {
      if (!this.props.animate) {
        return;
      }
      this.analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(10, 10, 10)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(4, 255, 0)';

      canvasCtx.beginPath();

      var sliceWidth = canvas.width * 1.0 / bufferLength;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
      requestAnimationFrame(draw);
    }
    draw();
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps);
    if (this.props.animate !== nextProps.animate) {
      // only return true if we are going from false => true
      // if we re-render when turning off animation, we will
      // cause the canvas to "clear" so the last visible wave
      // won't stay
      return nextProps.animate === true;
    }
    return true;
  }
  render() {
    console.log("Wave.render..", this.state);
    if (this.props.animate) {
      this.visualize();
    }
    return (
      <canvas
        id={this.props.id}
        width={this.props.width}
        height={this.props.height}
      ></canvas>
    );
  }
}

