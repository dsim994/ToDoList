



const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date");


const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];



//Database

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/todolistDB");
}

const itemsSchema = new mongoose.Schema ({
  name: String
});

const Item = new mongoose.model("Item", itemsSchema);








//Home Route
app.get("/", function(req, res) {

  const day = date.getDate()

  res.render("list", {listTitle: day, newListItems: items});

});

app.post("/", function(req, res) {

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});



//Work Route
app.get("/work", function(req, res) {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", function(req, res) {
  const item = req.body.workItems;
  workItems.push(item);
  res.redirect("/work");
});



//About Route
app.get("/about", function(req, res) {
  res.render("about");
})




app.listen(3000, function() {
  console.log("server started on port 3000");
})
