var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

// mongoose connection
mongoose.connect('mongodb://localhost/git', {useNewUrlParser: true, useUnifiedTopology: true});

// mongoose schema
var todoSchema = new mongoose.Schema({
    name: String
});
var completedSchema = new mongoose.Schema({
    name: String
});

var Todo = mongoose.model("Todo", todoSchema);
var Completed = mongoose.model("Completed", completedSchema);

// server listening on route 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});


// default route
app.get('/', function (req, res) {
    Todo.find({}, function (err, todoList) {
        if (err) console.log(err);
        else {
            Completed.find({}, function (err, completedList) {
                if (err) console.log(err);
                else {
                    res.render('index', {todoList: todoList, completedList: completedList});
                }
            });
        }
    })
});

// add task
app.post('/addtodo', function (req, res) {
    var new_todo = new Todo({
        name: req.body.newtodo
    });
    Todo.create(new_todo, function (err) {
        if (err) console.log(err);
        else {
            res.redirect('/');
        }
    })
});

// complete task
app.post('/completetodo', function (req, res) {
    Todo.deleteOne({
        name: req.body.completed
    }, function (err) {
        if (err) consol.log(err);
    });
    var new_completed = new Completed({
        name: req.body.completed
    });
    Completed.create(new_completed, function (err) {
        if (err) console.log(err);
        else {
            res.redirect('/');
        }
    })
});

