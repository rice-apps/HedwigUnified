import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0
    };
  }
  addValue = () => {
    this.setState({
      value: this.state.value + 1
    });
  };

  subValue = () => {
    this.setState({
      value: this.state.value - 1
    });
  };

  render() {
    if (this.state.value < 0) {
      throw new Error("Simulating React App Crash!");
    } else {
      return (
        <>
          <p>{this.state.value}</p>
          <button onClick={this.addValue}>+</button>
          <button onClick={this.subValue}>-</button>
        </>
      );
    }
  }
}

export default Counter;