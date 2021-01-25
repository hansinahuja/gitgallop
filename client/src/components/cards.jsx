import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Pagination from "@material-ui/lab/Pagination";
import "./cards.css";
import axios from "axios";
import Cookies from "js-cookie";
const parse = require("parse-link-header");

class Cards extends Component {
  state = {
    header: "",
    repos: [],
    all_repos: [],
    currentPage: 1,
    more: false,
    link: "",
  };

  async componentDidMount() {
    try {
      const username = this.props.user;
      const page = this.props.page;
      const { data: all_repos } = await axios.get(
        "https://api.github.com/users/" +
          username +
          "/" +
          page +
          "?per_page=96",
        {
          headers: {
            Authorization: "token " + Cookies.get("access_token"),
          },
        }
      );
      const repos = all_repos.slice(0, 12);
      const state = { ...this.state };
      state.repos = repos;
      state.all_repos = all_repos;
      if (page === "repos") {
        const { data: user } = await axios.get(
          "https://api.github.com/users/" + username,
          {
            headers: {
              Authorization: "token " + Cookies.get("access_token"),
            },
          }
        );
        if (user.public_repos > 96) state.more = true;
        state.link = "https://github.com/" + username + "?tab=repositories";
        state.header = "Public repositories »";
      } else {
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
        if (starred > 96) state.more = true;
        state.link = "https://github.com/" + username + "?tab=stars";
        state.header = "Starred repositories »";
      }
      this.setState(state);
    } catch (ex) {
      window.location = "/";
    }
  }

  handleChange = (event, page) => {
    let state = { ...this.state };
    state.currentPage = page;
    state.repos = state.all_repos.slice((page - 1) * 12, page * 12);
    this.setState(state);
  };

  render() {
    const { header, repos, all_repos } = this.state;
    const numPages = Math.ceil(all_repos.length / 12);
    return (
      <div>
        <p id="header">{header}</p>
        <br></br>
        <Grid container spacing={2}>
          {repos.map(
            (repo) =>
              repo && (
                <Grid item xs={4} key={repo.name}>
                  <div id="card" key={repo.name}>
                    <span id="content" key={repo.name}>
                      <b id="name" key={repo.name}>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          className="nostyle"
                        >
                          {repo.name}
                        </a>
                      </b>
                      <br></br>
                      <span id="details" key={repo.name + "2"}>
                        <span className="tags" id="lang" key={repo.name}>
                          <i
                            className="fa fa-code"
                            aria-hidden="true"
                            key={repo.name}
                          ></i>{" "}
                          {repo.language || "Unlisted"}
                        </span>
                        <span className="tags" id="forks" key={repo.name + "3"}>
                          <i
                            className="fa fa-code-fork"
                            aria-hidden="true"
                            key={repo.name}
                          ></i>{" "}
                          {repo.forks}
                        </span>
                        <span className="tags" id="stars" key={repo.name + "4"}>
                          <i
                            className="fa fa-star"
                            aria-hidden="true"
                            key={repo.name}
                          ></i>{" "}
                          {repo.stargazers_count}
                        </span>
                      </span>
                    </span>
                  </div>
                </Grid>
              )
          )}
          <Grid item xs={12} align="center">
            {repos.length === 0 && <p id="nonelisted">No repos here!</p>}
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          align="center"
          alignContent="center"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12}></Grid>
          {numPages > 1 && (
            <div id="pagination">
              <Pagination
                count={numPages}
                variant="outlined"
                onChange={this.handleChange}
              />
            </div>
          )}
          {this.state.more && (
            <Grid item xs={12}>
              <span id="viewmore">
                <a href={this.state.link} target="_blank" className="nostyle">
                  View all »
                </a>
              </span>
            </Grid>
          )}
        </Grid>
      </div>
    );
  }
}

export default Cards;
