const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    friends: [
      new mongoose.Schema({
        login: {
          type: String,
          required: true,
        },
        avatar_url: {
          type: String,
          required: true,
        },
      }),
    ],
  })
);

module.exports = User;
