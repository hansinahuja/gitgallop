import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Avatar from "@material-ui/core/Avatar";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import Grid from "@material-ui/core/Grid";
import "./rightPane.css";
import axios from "axios";
import Cookies from "js-cookie";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
const config = require("../config.json");
const apiUrl = config.apiUrl;

const CustomSwitch = withStyles({
  switchBase: {
    color: green[300],
    "&$checked": {
      color: green[500],
    },
    "&$checked + $track": {
      backgroundColor: green[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

class RightPane extends Component {
  state = {
    followers: [],
    following: [],
    friends: [],
    num_followers: 0,
    num_following: 0,
    num_friends: 0,
    me: false,
    friend: false,
    avatar_url: "",
    login: "",
  };

  async componentDidMount() {
    try {
      const state = { ...this.state };
      var username = this.props.user;
      // state.login = username;

      const { data: user } = await axios.get(
        "https://api.github.com/users/" + username,
        {
          headers: {
            Authorization: "token " + Cookies.get("access_token"),
          },
        }
      );
      username = user.login;
      state.login = user.login;
      state.num_followers = user.followers;
      state.num_following = user.following;
      state.avatar_url = user.avatar_url;
      // console.log(username);
      const { data: followers } = await axios.get(
        "https://api.github.com/users/" + username + "/followers?per_page=4",
        {
          headers: {
            Authorization: "token " + Cookies.get("access_token"),
          },
        }
      );
      // console.log(username, followers);
      const { data: following } = await axios.get(
        "https://api.github.com/users/" + username + "/following?per_page=4",
        {
          headers: {
            Authorization: "token " + Cookies.get("access_token"),
          },
        }
      );
      var { data: friends } = await axios.get(
        apiUrl + "/api/users/" + username
      );
      if (friends.length !== 0) friends = friends[0].friends;
      state.num_friends = friends.length;
      // state.num_friends = 0;
      state.friends = [];
      for (var i = 0; i < Math.min(friends.length, 3); i++) {
        // let new_friend = ;
        state.friends.push({
          login: friends[i].login,
          avatar_url: friends[i].avatar_url,
        });
      }
      state.followers = followers;
      state.following = following;
      // console.log(username, this.props.username);
      if (username === Cookies.get("username")) state.me = true;
      // console.log(username, state);
      if (!state.me) {
        try {
          const { data: isFriend } = await axios.get(
            apiUrl + "/api/users/" + this.props.username + "/" + username
          );
          state.friend = isFriend;
        } catch (ex) {
          // console.log(ex);
        }
      }
      this.setState(state);
      // console.log(state);
      // console.log("Hello", username, this.props);
    } catch (ex) {
      window.location = "/";
    }

    // console.log(state);
  }

  handleChange = async () => {
    const state = { ...this.state };
    state.friend = !state.friend;
    this.setState(state);
    if (state.friend) {
      // false first
      try {
        const res = await axios.put(
          apiUrl + "/api/users/add/" + this.props.username,
          {
            login: this.state.login,
            avatar_url: this.state.avatar_url,
          },
          {
            headers: {
              access_token: Cookies.get("access_token"),
            },
          }
        );
        // console.log("adding", res);
      } catch (ex) {
        if (ex.response && ex.response.status === 409) {
          console.log("Resource already exists!");
        } else {
          console.log("An error occurred!");
          state.friend = !state.friend;
          this.setState(state);
          console.log(ex);
        }
      }
    } else {
      try {
        const res = await axios.put(
          apiUrl +
            "/api/users/remove/" +
            this.props.username +
            "/" +
            this.state.login,
          {
            headers: {
              access_token: Cookies.get("access_token"),
            },
          }
        );
        // console.log("removing", res);
      } catch (ex) {
        console.log(ex);
        if (ex.response && ex.response.status === 404) {
          console.log("Resource not found!");
        } else {
          console.log("An error occurred!");
          state.friend = !state.friend;
          this.setState(state);
          console.log(ex);
        }
      }
    }
  };

  avatars(users, num_users) {
    if (num_users === 0) return <span id="none">No users here!</span>;
    return (
      <AvatarGroup border="transparent">
        {users.map((user) => (
          <Avatar
            src={user.avatar_url}
            key={user.avatar_url}
            style={{ height: "50px", width: "50px" }}
          ></Avatar>
        ))}
        {num_users > 3 && (
          <Avatar
            src={
              "https://dummyimage.com/200x200/000/ffffff&text=˖" +
              (num_users - 3).toString()
            }
            style={{ height: "50px", width: "50px" }}
          ></Avatar>
        )}
      </AvatarGroup>
    );
  }

  render() {
    const {
      followers,
      following,
      friends,
      num_followers,
      num_following,
      num_friends,
      me,
    } = this.state;
    const username = this.props.user;
    const dummy = "https://dummyimage.com/5x1/000/fff";
    return (
      <div id="rightPane">
        <div className="row">
          {/* {console.log("in", this.state)} */}
          {me && (
            <div id="users" className="col">
              <a href={"/" + username + "/friends"} className="nostyle">
                <h5 id="tag">Friends</h5>
                <Grid
                  container
                  direction="column"
                  alignItems="center"
                  justify="center"
                >
                  {this.avatars(friends, num_friends)}
                </Grid>
              </a>
            </div>
          )}
          {!me && (
            <div id="users" className="col">
              <h5 id="tag">Add as friend?</h5>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                <CustomSwitch
                  checked={this.state.friend}
                  onChange={this.handleChange}
                  name="checkedA"
                />
              </Grid>
            </div>
          )}
          <div id="users" className="col mr-3 ml-3">
            <a href={"/" + username + "/followers"} className="nostyle">
              <h5 id="tag">Followers</h5>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                {this.avatars(followers, num_followers)}
              </Grid>
            </a>
          </div>

          <div id="users" className="col">
            <a href={"/" + username + "/following"} className="nostyle">
              <h5 id="tag">Following</h5>
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                {this.avatars(following, num_following)}
              </Grid>
            </a>
          </div>
        </div>
        <div className="row" id="row2">
          <div id="users" className="col mr-3 u1">
            <a href={"/" + username + "/repos"} className="nostyle">
              <h5 id="tag">Public repositories</h5>
              <div id="img1" className="ir1"></div>
            </a>
          </div>
          <div id="users" className="col u2">
            <a href={"/" + username + "/starred"} className="nostyle">
              <h5 id="tag">Starred repositories</h5>
              <div id="img2" className="ir1"></div>
            </a>
          </div>
        </div>
        <div className="row" id="row2">
          <div id="users" className="col u3">
            <a href={"/" + username + "/activity"} className="nostyle">
              <h5 id="tag">Recent activity</h5>
              <div id="img3" className="ir2"></div>
              {/* </Link> */}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default RightPane;
