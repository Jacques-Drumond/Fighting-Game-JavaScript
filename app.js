var mysql = require('mysql');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv')

dotenv.config({ path: './.env'})

const app = express();
const port = process.env.PORT || 8080;

var mysql = require('mysql');

var db = mysql.createConnection({
  database: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});


const publicDirectory = path.join(__dirname, './public')
app.use( express.static( publicDirectory ));

app.set('view engine', 'hbs')


db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});


app.get('/game', (req, res) =>{
  res.render('index')
})


app.listen(port);
console.log('Server started at port: ' + port);
