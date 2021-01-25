const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const users = require("./routes/users");
const auth = require("./routes/auth");
const config = require("./config.json");

app.use(express.json());
app.use(cors());
app.use("/api/users", users);
app.use("/auth", auth);

mongoose
  .connect(config.db)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

const port = process.env.PORT || config.serverPort;
app.listen(port, () => console.log(`Listening on port ${port}...`));
