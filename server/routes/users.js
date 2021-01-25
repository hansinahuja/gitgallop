const express = require("express");
const router = express.Router();
const User = require("../models/user");
const axios = require("axios");

router.get("/:username", async (req, res) => {
  const user = await User.find({ username: req.params.username });
  res.send(user);
  // res.json(user);
});

router.post("/:username", async (req, res) => {
  const check = await User.findOne({ username: req.params.username });
  if (check) return res.send(check);

  let user = new User({
    username: req.params.username,
    friends: [],
  });
  user = await user.save();
  res.send(user);
});

router.get("/:username/:friend", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const friend = user.friends.find((f) => f.login === req.params.friend);
  if (friend) return res.send(true);
  else return res.status(404).send(false);
});

router.put("/add/:username", async (req, res) => {
  // console.log("IN");
  const user = await User.findOne({ username: req.params.username });
  const friend = user.friends.find((f) => f.login === req.body.login);
  if (friend) return res.status(409).send("Resource already exists.");

  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + req.params.access_token,
    },
  }).then((response) => {
    if (response.data.login !== req.params.username)
      return res.status(403).send("Forbidden request!");
  });

  user.friends.push(req.body);
  const result = await user.save();
  // console.log("added!");
  res.send(result);
});

router.put("/remove/:username/:friend", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  const friend = user.friends.find((f) => f.login === req.params.friend);
  if (!friend) return res.status(404).send("Resource not found.");
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + req.params.access_token,
    },
  }).then((response) => {
    if (response.data.login !== req.params.username)
      return res.status(403).send("Forbidden request!");
  });
  const index = user.friends.indexOf(friend);
  user.friends.splice(index, 1);
  const result = await user.save();
  // console.log("removed!");
  res.send(result);
});

module.exports = router;
