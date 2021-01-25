import React, { Component } from "react";
import "./leftPane.css";
import axios from "axios";
import Cookies from "js-cookie";
const parse = require("parse-link-header");

class LeftPane extends Component {
  state = {
    avatar_url: "https://dummyimage.com/1024x1024/212121/212121",
    login: "",
    bio: "",
    followers: 0,
    following: 0,
    public_repos: 0,
    public_gists: 0,
    created_at: 0,
  };

  async componentDidMount() {
    const username = this.props.user;
    try {
      let { data: user } = await axios.get(
        "https://api.github.com/users/" + username,
        {
          headers: {
            Authorization: "token " + Cookies.get("access_token"),
          },
        }
      );
      const state = (({
        avatar_url,
        login,
        bio,
        followers,
        following,
        public_repos,
        public_gists,
        created_at,
      }) => ({
        avatar_url,
        login,
        bio,
        followers,
        following,
        public_repos,
        public_gists,
        created_at,
      }))(user);

      const starred_call = await axios.get(
        "https://api.github.com/users/" + username + "/starred?per_page=1",
        {
          headers: {
            Authorization: "token " + Cookies.get("access_token"),
          },
        }
      );
      let starred = starred_call.data.length;
      if (starred_call.headers.link) {
        const { last } = parse(starred_call.headers.link);
        starred = parseInt(last.page);
      }
      state.starred = starred;
      this.setState(state);
    } catch (ex) {
      window.location = "/";
    }
  }

  render() {
    const {
      avatar_url,
      login,
      bio,
      followers,
      following,
      public_repos,
      created_at,
      public_gists,
      starred,
    } = this.state;
    const duration = Math.round(
      (Date.now() - new Date(created_at)) / 1000 / 60 / 60 / 24 / 365
    );
    const username = this.props.user;
    return (
      <div id="leftpane">
        <div id="box1">
          <a href={"/" + username} className="nostyle">
            <img id="image" src={avatar_url + ".png"}></img>
          </a>
          <br></br>
        </div>
        <a
          href={"https://github.com/" + login}
          target="_blank"
          className="nostyle"
        >
          <div id="box2">@{login} on Github</div>
        </a>
        <div id="box3">
          <p id="line3">
            <br></br>
            <span id="bio">
              <a
                href={"https://github.com/" + login}
                target="_blank"
                className="nostyle"
              >
                {bio || "No bio listed :("}
              </a>
            </span>
            <br></br>
            <span id="followers">
              <a
                href={"https://github.com/" + login + "?tab=followers"}
                target="_blank"
                className="nostyle"
              >
                <b>{followers}</b> followers &ensp;{" "}
              </a>
            </span>{" "}
            <span id="bar">|</span>{" "}
            <span id="following">
              <a
                href={"https://github.com/" + login + "?tab=following"}
                target="_blank"
                className="nostyle"
              >
                &ensp; <b>{following}</b> following
              </a>
            </span>
            <br></br>
            <span id="repos">
              <a
                href={"https://github.com/" + login + "?tab=repositories"}
                target="_blank"
                className="nostyle"
              >
                <b>{public_repos}</b> public repositories
              </a>
            </span>
            <br></br>
            <span id="gists">
              <a
                href={"https://gist.github.com/" + login}
                target="_blank"
                className="nostyle"
              >
                <b>{public_gists}</b> public gists
              </a>
            </span>
            <br></br>
            <span id="starred">
              <a
                href={"https://github.com/" + login + "?tab=stars"}
                target="_blank"
                className="nostyle"
              >
                Starred <b>{starred}</b> times{" "}
              </a>
            </span>
            <br></br>
            <span id="duration">
              <a
                href={"https://github.com/" + login}
                target="_blank"
                className="nostyle"
              >
                Member for <b>{duration}</b> years
              </a>
            </span>
            <br></br>
          </p>
          <br></br>
          {this.props.return && (
            <a href={"/" + username} className="nostyle">
              {/* <Link to={"/" + username} style={{ textDecoration: "none" }}> */}
              <div id="box2">Return to profile page</div>
              {/* </Link> */}
            </a>
          )}
          {!this.props.return && <div id="box22">Return to profile page</div>}
        </div>
      </div>
    );
  }
}

export default LeftPane;
