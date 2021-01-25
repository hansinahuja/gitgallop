import React, { Component } from "react";

class Loading extends Component {
  state = {};
  render() {
    return (
      <img
        src="https://i.imgur.com/7SqI6UB.gif"
        style={{ height: "100%", width: "100%" }}
      ></img>
    );
  }
}

export default Loading;
