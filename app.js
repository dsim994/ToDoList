

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("list");
});

app.listen(3000, function() {
  console.log("server started on port 3000");
})
