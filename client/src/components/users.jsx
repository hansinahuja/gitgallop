import React, { Component } from "react";
import { Tooltip } from "@chakra-ui/react";
import Grid from "@material-ui/core/Grid";
import Cookies from "js-cookie";
import "./users.css";
import axios from "axios";
const config = require("../config.json");
const apiUrl = config.apiUrl;

class Users extends Component {
  state = {
    header: "",
    users: [],
    more: false,
    link: "",
  };

  async componentDidMount() {
    try {
      var username = this.props.user;
      const page = this.props.page;
      const state = { ...this.state };
      state.header = page.charAt(0).toUpperCase() + page.slice(1) + " »";
      if (page === "friends") {
        var { data } = await axios.get(apiUrl + "/api/users/" + username);
        state.users = data[0].friends;
        this.setState(state);
        // console.log(data);
      } else {
        const { data } = await axios.get(
          "https://api.github.com/users/" +
            username +
            "/" +
            page +
            "?per_page=72",
          {
            headers: {
              Authorization: "token " + Cookies.get("access_token"),
            },
          }
        );
        // console.log(data);

        state.users = data;
        state.link = "https://github.com/" + username + "?tab=" + page;

        this.setState(state);
        const { data: user } = await axios.get(
          "https://api.github.com/users/" + username,
          {
            headers: {
              Authorization: "token " + Cookies.get("access_token"),
            },
          }
        );
        if (user[page] > 72) {
          const new_state = { ...this.state };
          new_state.more = true;
          this.setState(new_state);
        }
      }
    } catch (ex) {
      window.location = "/";
    }

    // console.log(state);
  }

  userClick = (login) => {
    window.location = "/" + login;
  };

  render() {
    const { users, header } = this.state;
    return (
      <div>
        <p id="header">{header}</p>
        <br></br>
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item xs={1} key={user.login}>
              <Tooltip
                label={user.login}
                aria-label="A tooltip"
                key={user.login}
              >
                <a href={"/" + user.login} className="nostyle">
                  {/* <Link to={"/" + user.login} style={{ textDecoration: "none" }}> */}
                  <img
                    id="images"
                    src={user.avatar_url}
                    alt={user.login}
                    // onClick={() => this.userClick(user.login)}
                  ></img>
                </a>
                {/* </Link> */}
              </Tooltip>
            </Grid>
          ))}
          {this.state.more && (
            <Grid item xs={12} align="center">
              <span id="viewmore">
                {/* {console.log(String(username))} */}
                <a href={this.state.link} target="_blank" className="nostyle">
                  View all »
                </a>
              </span>
            </Grid>
          )}
          <Grid item xs={12} align="center">
            {users.length === 0 && <p id="nonelisted">No users here!</p>}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Users;
