import React, { Component } from "react";
import "./timeline.css";
import Cookies from "js-cookie";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  Gollum,
  Member,
  Release,
  Sponsor,
  Comment,
  Delete,
  Push,
  Issue,
  Fork,
  Pull,
  Public,
  Create,
  Watch,
} from "./icons";
import axios from "axios";

class Timeline extends Component {
  state = {
    login: "hansinahuja",
    activity: [],
  };

  async componentDidMount() {
    try {
      const username = this.props.user;
      const { data } = await axios.get(
        "https://api.github.com/users/" +
          username +
          "/events/public?per_page=25",
        {
          headers: {
            Authorization: "token " + Cookies.get("access_token"),
          },
        }
      );
      let state = { ...this.state };
      const events = [];
      for (let key in data) {
        let y = {
          type: data[key].type,
          created_at: data[key].created_at,
          repo: data[key].repo.name,
        };
        events.push(y);
      }
      state.activity = events;
      state.link = "https://github.com/" + username + "?tab=overview";
      this.setState(state);
    } catch (ex) {
      window.location = "/";
    }
  }

  render() {
    const { login, activity } = this.state;
    return (
      <div style={{ overflow: "auto", maxHeight: "100vh" }}>
        <p id="header">Recent activity »</p>
        <br></br>
        {activity.length === 0 && (
          <span id="empty">
            No recent activity :(<br></br>
          </span>
        )}
        {activity.length > 0 && (
          <VerticalTimeline
            className="custom-line"
            lineColor="black"
            layout="1-column-left"
          >
            {activity.map((action) => (
              <VerticalTimelineElement
                className="hover"
                contentStyle={{ background: "#ffab52", color: "#000" }}
                contentArrowStyle={{ borderRight: "7px solid #ffab52" }}
                iconStyle={{
                  background: "white",
                  color: "#DB4200",
                  margin: "auto",
                }}
                icon={
                  (action.type === "GollumEvent" && <Gollum />) ||
                  (action.type === "MemberEvent" && <Member />) ||
                  (action.type === "ReleaseEvent" && <Release />) ||
                  (action.type === "SponsorshipEvent" && <Sponsor />) ||
                  (action.type === "CommitCommentEvent" && <Comment />) ||
                  (action.type === "IssueCommentEvent" && <Comment />) ||
                  (action.type === "PullRequestReviewCommentEvent" && (
                    <Comment />
                  )) ||
                  (action.type === "DeleteEvent" && <Delete />) ||
                  (action.type === "PushEvent" && <Push />) ||
                  (action.type === "IssuesEvent" && <Issue />) ||
                  (action.type === "ForkEvent" && <Fork />) ||
                  (action.type === "PullRequestEvent" && <Pull />) ||
                  (action.type === "PublicEvent" && <Public />) ||
                  (action.type === "CreateEvent" && <Create />) ||
                  (action.type === "WatchEvent" && <Watch />)
                }
                key={action.created_at + "1"}
              >
                <span className="action" key={action.created_at + "2"}>
                  <a
                    href={"https://github.com/" + action.repo}
                    target="_blank"
                    className="nostyle"
                  >
                    {action.type}
                  </a>
                </span>
                <br></br>
                <span className="link" key={action.created_at + "3"}>
                  <i className="fab fa-github"></i>{" "}
                  <a
                    href={"https://github.com/" + action.repo}
                    target="_blank"
                    className="nostyle"
                  >
                    {action.repo}
                  </a>
                </span>
                <br></br>
                <span className="date" key={action.created_at + "4"}>
                  {" "}
                  <i
                    className="far fa-calendar-alt"
                    key={action.created_at + "5"}
                  ></i>{" "}
                  <a
                    href={"https://github.com/" + action.repo}
                    target="_blank"
                    className="nostyle"
                  >
                    {action.created_at}
                  </a>
                </span>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        )}
        <span id="viewmore">
          <br></br>
          <a href={this.state.link} target="_blank" className="nostyle">
            View older activity »
          </a>
        </span>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
    );
  }
}

export default Timeline;
