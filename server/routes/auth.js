const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/user");
const config = require("../config.json");

const client_id = config.client_id;
const client_secret = config.client_secret;
const clientUrl = config.clientUrl;

router.get("/callback", async (req, res) => {
  const requestToken = req.query.code;
  try {
    axios({
      method: "post",
      url: `https://github.com/login/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}&code=${requestToken}`,
      headers: {
        accept: "application/json",
      },
    }).then((response) => {
      const access_token = response.data.access_token;
      res.cookie("access_token", access_token);
      res.redirect(clientUrl);
    });
  } catch (ex) {
    res.redirect(clientUrl);
  }
});

router.get("/verify/:access_token", async (req, res) => {
  try {
    axios({
      method: "get",
      url: `https://api.github.com/user`,
      headers: {
        Authorization: "token " + req.params.access_token,
      },
    }).then(async (response) => {
      const check = await User.findOne({ username: response.data.login });
      // console.log(req.params.username);
      if (!check) {
        let user = new User({
          username: response.data.login,
          friends: [],
        });
        user = await user.save();
      }

      res.send(response.data.login);
    });
  } catch (ex) {
    // console.log(ex);
    res.send("");
  }
});

module.exports = router;
