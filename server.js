const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());

//var app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);


app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mongo Atlas Connection URL
const uri = "mongodb+srv://sheikhzain:zain%401234@zain-deakin-uni.4xornvl.mongodb.net/test";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// On Successful Connection
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connection Established Successfully !");
});

const cardSchema = new mongoose.Schema({
  title: String,
  image: String,
  link: String,
  description: String,
});


// ->> Testing user 
app.get("/test", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});


// ->> When user is Connected or Disconnected
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  setInterval(() => {
    socket.emit('Random Number is', parseInt(Math.random() * 10));
  }, 1000);
});




const Card = mongoose.model("Card", cardSchema);

// API endpoint to get projects from the database
app.get("/api/projects", async (req, res) => {
  try {
    const cardList = await Card.find();
    res.json({ statusCode: 200, data: cardList, message: "Success" });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal Server Error" });
  }
});

// Start the server
const port = process.env.PORT || 3000;
http.listen(port,()=>{
  console.log("Listening on port ", port);
});
