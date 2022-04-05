var mysql = require('mysql');
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "loginnodejs"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// sendFile will go here
app.use( express.static( __dirname + '/public' ));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port);
console.log('Server started at http://localhost:' + port);
