import React, { Component } from "react";
import "./friend.css";

export class Friend extends Component {
  state = {};

  render() {
    return (
      <div>
        <input class="tgl tgl-flip" id="cb5" type="checkbox" />
        <label
          class="tgl-btn"
          data-tg-off="Nope"
          data-tg-on="Yeah!"
          for="cb5"
        ></label>
      </div>
    );
  }
}

export default Friend;
