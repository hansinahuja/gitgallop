// import React from "react";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Cookies from "js-cookie";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { createMuiTheme } from "@material-ui/core/styles";
import "./navbar.css";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#212121",
    },
    secondary: {
      main: "#eb5a1c",
    },
  },
});

const useStyles = (theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },

  search: {
    position: "relative",
    marginRight: theme.spacing(0),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(104),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    // inputProps={{ spellCheck: 'false' }}
    color: "#f57f4c",
    // marginLeft: "0",
    alignSelf: "left",
    // fontFamily: "Noto Sans JP, sans-serif",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  input: {
    color: "white",
  },
  sectionDesktop: {
    display: "none",
    // paddingLeft: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "flex",
      // marginLeft: theme.spacing(1),
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
});

class PrimarySearchAppBar extends Component {
  // export default function PrimarySearchAppBar() {
  state = {
    search: "",
  };

  handleChange = (e) => {
    const search = e.currentTarget.value;
    this.setState({ search });
    // console.log(this.state);
  };

  handlePress = async (e) => {
    if (e.key === "Enter") {
      try {
        const { data } = await axios.get(
          "https://api.github.com/users/" + this.state.search,
          {
            headers: {
              Authorization: "token " + Cookies.get("access_token"),
            },
          }
        );
        // console.log(data);
        this.props.history.push("/" + data.login);
        window.location.reload();
      } catch (ex) {
        // console.log(ex);
        if (ex.response && ex.response.status === 404) {
          toast.error("Github user not found!");
        } else {
          toast.error("An unexpected error occured!");
        }
      }
    }
    // this.props.history.push('/Bldgs');
  };

  handleLogout = () => {
    Cookies.remove("access_token");
    window.location = "/";
  };

  render() {
    // const classes = useStyles();
    const { classes } = this.props;
    return (
      <div className={classes.grow}>
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
        <AppBar style={{ backgroundColor: "#333333" }} position="fixed">
          <Toolbar>
            <div
              className="logo"
              style={{ marginLeft: "7.1%", marginTop: "22px" }}
            >
              {/* <Link to="/" style={{ textDecoration: "none" }}> */}
              <a href="/" className="nostyle">
                <b>
                  GI<span>T</span>GA<span>L</span>LOP
                </b>
                {/* </Link> */}
              </a>
            </div>
            <div className={classes.search}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.300" />}
                />
                <Input
                  focusBorderColor="orange.400"
                  spellCheck="false"
                  type="text"
                  placeholder="Search"
                  autoComplete="off"
                  onChange={this.handleChange}
                  id="search"
                  name="search"
                  onKeyPress={this.handlePress}
                />
              </InputGroup>
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton style={{ color: "#eb5a1c" }}>
                <ExitToAppIcon id="exit" onClick={this.handleLogout} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withRouter(withStyles(useStyles)(PrimarySearchAppBar));
