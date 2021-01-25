import React, { Component } from "react";
import { GithubLoginButton } from "react-social-login-buttons";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import Grid from "@material-ui/core/Grid";
const config = require("../config.json");

const client_id = config.client_id;

class Login extends Component {
  state = {};

  componentDidMount() {
    if (this.props.invalid) toast.error("Invalid access token!");
  }

  render() {
    return (
      <React.Fragment>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div id="wrapper">
          <Grid container spacing={3}>
            <Grid item xs={12} align="center">
              <div
                className="mainlogo"
                style={{ width: "100%", marginLeft: "35.5%", marginTop: "19%" }}
              >
                <b>
                  GI<span>T</span>GA<span>L</span>LOP
                </b>
              </div>
            </Grid>
            <Grid item xs={12} align="center">
              <a
                href={
                  "https://github.com/login/oauth/authorize?client_id=" +
                  client_id
                }
                className="nostyle"
              >
                <GithubLoginButton
                  align="center"
                  style={{ transitionDuration: "0.15s", width: "18%" }}
                />
              </a>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
