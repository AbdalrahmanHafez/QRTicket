const express = require("express");
const app = express();

const path = require("path");
const logger = require("morgan");
const cors = require("cors");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/", require("./Server.js"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "./Frontend/build")));

  app.get("*", function (_, res) {
    res.sendFile(
      path.join(__dirname, "./Frontend/build/index.html"),
      function (err) {
        if (err) {
          res.status(500).send(err);
        }
      }
    );
  });
}

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server Running on port ${port}`));
