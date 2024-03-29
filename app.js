const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];









//Database

main().catch(err => console.log(err));

async function main() {

  let atlasURI = "mongodb+srv://dsim994:Bimmer335i.@cluster0.lzeurjo.mongodb.net/todolistDB"

  await mongoose.connect(atlasURI);
  
  console.log("DB connected");
}





//Item Database

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = new mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];






//List Database

const listSchema = ({
  name: String,
  items: [itemsSchema]
});


const List = new mongoose.model("List", listSchema);






//Home Route
app.get("/", function(req, res) {


  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {

      Item.insertMany(defaultItems, function(err) {

        if (err) {
          console.log(err);
        } else {
          console.log("Successfully updated the document")
        }
      });

      res.redirect("/");

    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});





//Custom Name Route
app.get("/:customListName", function(req, res) {


  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {

        const list = new List({
          name: customListName,
          items: defaultItems
        });

        list.save();
        res.redirect("/" + customListName);

      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }

  });

});




//Post Method

app.post("/", function(req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {

    item.save();
    res.redirect("/");

  } else {

    List.findOne({
      name: listName
    }, function(err, foundList) {

      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });

  }
});





//Delete Method

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;

  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (!err) {
        console.log("Successfully updated the document");
        res.redirect("/")
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }

});







app.get("/about", function(req, res) {
  res.render("about");
});


let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server is running on port 3000!");
});
