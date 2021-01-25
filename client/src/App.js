import "./App.css";
import React, { Component } from "react";
import { useState, useEffect } from "react";
import PrimarySearchAppBar from "./components/navbar";
import Profile from "./components/profile";
import Login from "./components/login";
import Loading from "./components/loading";
import Cookies from "js-cookie";
import axios from "axios";
import { Route, Switch, Redirect } from "react-router-dom";
const config = require("./config.json");
const apiUrl = config.apiUrl;

class App extends Component {
  state = {
    access_token: "",
    error: false,
    username: "",
    loading: true,
  };

  async componentDidMount() {
    // console.log(process.env, config);
    // localStorage.setItem("access_token", "testing");
    const access_token = Cookies.get("access_token");

    if (access_token) {
      this.setState({ access_token });
      const { data: username } = await axios.get(
        apiUrl + "/auth/verify/" + access_token
      );
      if (username) {
        this.setState({ username });
        Cookies.set("username", username);
        // console.log(username);
      } else {
        this.setState({ error: true });
      }
    }
    this.setState({ loading: false });
  }

  render() {
    // console.log(this.state);
    if (this.state.loading) return <Loading></Loading>;

    if (!this.state.access_token) {
      return <Login invalid={this.state.error}></Login>;
    }
    if (!this.state.username) {
      return <Login invalid={this.state.error}></Login>;
    }

    return (
      <React.Fragment>
        <PrimarySearchAppBar></PrimarySearchAppBar>

        <main
          style={{
            marginTop: "78px",
            width: "100%",
            padding: "0",
            height: "100vh",
          }}
        >
          {/* <Profile username={this.state.username}></Profile> */}
          <Switch>
            <Route
              path="/:user/friends"
              render={(props) => (
                <Profile
                  page="friends"
                  username={this.state.username}
                  {...props}
                ></Profile>
              )}
            ></Route>
            <Route
              path="/:user/followers"
              render={(props) => (
                <Profile
                  page="followers"
                  username={this.state.username}
                  {...props}
                ></Profile>
              )}
            ></Route>
            <Route
              path="/:user/following"
              render={(props) => (
                <Profile
                  page="following"
                  username={this.state.username}
                  {...props}
                ></Profile>
              )}
            ></Route>
            <Route
              path="/:user/repos"
              render={(props) => (
                <Profile
                  page="repos"
                  username={this.state.username}
                  {...props}
                ></Profile>
              )}
            ></Route>
            <Route
              path="/:user/starred"
              render={(props) => (
                <Profile
                  page="starred"
                  username={this.state.username}
                  {...props}
                ></Profile>
              )}
            ></Route>
            <Route
              path="/:user/activity"
              render={(props) => (
                <Profile
                  page="activity"
                  username={this.state.username}
                  {...props}
                ></Profile>
              )}
            ></Route>
            <Route
              path="/:user"
              render={(props) => (
                <Profile
                  page="home"
                  username={this.state.username}
                  {...props}
                ></Profile>
              )}
            ></Route>
            <Redirect to={"/" + this.state.username}></Redirect>
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
