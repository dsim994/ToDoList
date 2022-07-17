

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];

app.get("/", function(req, res) {

  const day = date.getDate();

  res.render("list", {kindOfDay: day, newListItems: items});
});

app.post("/", function(req, res) {
  const item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

app.get("/about", function(req, res) {
  res.render("about");
})


app.listen(3000, function() {
  console.log("server started on port 3000");
})
