const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to the todolist."
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "Hit this to delete an item."
});
const defaultItem = [item1, item2, item3];




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get('/', function (req, res) {

    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItem, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("successfully done.")
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

app.post("/", function (req, res) {
    console.log(req.body);
    const itemName = req.body.newItem;
    const item = new Item ({
        name: itemName
    });


    item.save();

    res.redirect("/");
});

app.post("/delete", function(req, res) {
    console.log(req.body.checkbox);
});


app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    });
});

app.post("/work", function (req, res) {
    let item = req.body.item;
    workItems.push(item);
    res.redirect("/work");
});

app.get('/about', function (req, res) {
    res.render('about');
});

app.listen(3000, function () {
    console.log("Server is listening on port 3000!");
});