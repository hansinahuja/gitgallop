import React, { Component } from "react";
import "./profile.css";
import LeftPane from "./leftPane";
import RightPane from "./rightPane";
import Users from "./users";
import Cards from "./cards";
import Timeline from "./timeline";

class Profile extends Component {
  state = {};

  render() {
    const user = this.props.match.params.user;
    const page = this.props.page;
    const username = this.props.username;
    return (
      <div className="row" style={{ height: "100%" }}>
        <div className="col-4" style={{ backgroundColor: "#212121" }}>
          {/* <Route path="/:user" component={LeftPane}></Route> */}
          <LeftPane user={user} return={page !== "home"}></LeftPane>
        </div>

        <div
          className="col-8"
          style={{ backgroundColor: "#ffffff", padding: "3%" }}
        >
          {page === "friends" && <Users page={page} user={user}></Users>}
          {page === "followers" && <Users page={page} user={user}></Users>}
          {page === "following" && <Users page={page} user={user}></Users>}
          {page === "repos" && <Cards page={page} user={user}></Cards>}
          {page === "starred" && <Cards page={page} user={user}></Cards>}
          {page === "activity" && <Timeline user={user}></Timeline>}
          {page === "home" && (
            <RightPane user={user} username={username}></RightPane>
          )}
          {/* {console.log("test", username)} */}
        </div>
      </div>
    );
  }
}

export default Profile;
