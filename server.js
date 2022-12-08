require('dotenv').config(); 
var express = require("express");
var mongoose = require("mongoose");
var dbUrl = process.env.MONGODB
var bodyParser = require("body-parser");
var app = express();

mongoose.connect(dbUrl, (err) => {
    console.log("mongodb connected", err);
})
var Message = mongoose.model("Message", {name: String,
message: String})

var http = require("http").Server(app);
var io = require("socket.io")(http);

io.on("connection", () => {
    console.log("a user is connected")
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(__dirname));

app.use(express.static("public"));

app.get("/messages", (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.post("/messages", (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if(err)
        sendStatus(500);
        res.sendStatus(200);
    })
})

app.post("/message", (req, res) => {
    var message = new Message (req.body);
    message.save((err) => {
        if(err)
        sendStatus(500);
        io.emit("message", req.body);
        res.sendStatus(200);
    })
})

var server = app.listen(3000, () => {
    console.log("Server is running on port",
    server.address().port);
});