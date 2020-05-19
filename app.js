/* Error managing */
const ejs = require('ejs');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const logger = require('morgan');
const index = require('./routes/index');
const Database = require('better-sqlite3');






const db = new Database('./accounts.db')
db.exec('CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, username varchar(255), password varchar(255), salt varchar(255))')

const db2 = new sqlite3.Database('./events.db')
db2.exec('CREATE TABLE IF NOT EXISTS onlinemeetings (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, name varchar(255), date varchar(255), link varchar(255), description varchar(255), host varchar(255))')

const app = express(); 

var router = express.Router();



app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', function(req,res){
  let username = req.body.email;
  let password = req.body.password;
  console.log(req.body.email);
  console.log(req.body.password)

  let stmt = db.prepare('SELECT * from users WHERE username=? AND password=?')
  let row = stmt.get(username, password)
  if(row == undefined){ 
      res.send('Login Failed! Email or Password Incorrect. Please refresh page and try again!')
  }  
  else{ //if success
      res.redirect('/main')
  }

  
});


app.post('/register', function(req,res){
  let username = req.body.email;
  let password = req.body.password;
  console.log()

  let stmt = db.prepare('SELECT * from users WHERE username=?')
  let row = stmt.get(username)

  if(row == undefined){
      let insert = db.prepare('INSERT INTO users (username, password, salt) VALUES (?,?,?) ')
      insert.run(username, password, 'SALT')
     // let filePath = path.join(__dirname, 'authenticate.html')
      //res.sendFile(filePath)
      router.get('/register')
  }
  else{
    res.redirect('/login')
  }
  
});

app.post('/submit', function(req,res){
   let name = req.body.name;
    let date = req.body.date;
    let link = req.body.link;
    let description = req.body.description;
    let host = req.body.host;
    let insert = db2.prepare('INSERT INTO onlinemeetings (name, date, link, description, host) VALUES (?,?,?,?,?)')
    if(insert.run(name, date, link, description, host)){
      res.redirect('/find')
    }
    else{
      res.redirect('submit')   
    }
  
});

app.get('/find',function(req,res){
let sql = `SELECT DISTINCT * FROM onlinemeetings
  ORDER BY id`;
  db2.all(sql, [], (err, rows) => {
    events = [];
    if (err) {
       throw err;
    }
    rows.forEach((row) => {
       let current = new event(row.name, row.date, row.link, row.description, row.host);
       events.push(current);
     });
 
     // Send the completed template back to the client
     res.render('find' , {
         page:'Find', 
         menuId:'find',
         events:events
      });
 });
 return;
});


/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* set path for static assets */
app.use(express.static(path.join(__dirname, 'public')));


/* routes */
app.use('/', index); 

/* catch 404 and forward to error handler */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* error handler */
app.use(function(err, req, res, next) {
  /* render the error page */
  res.status(err.status || 500);
  res.render('error', {status:err.status, message:err.message});
});


module.exports = app;


class event{
   
  constructor(name, date, link, description, host) {
      this.name = name;
      this.date = date;
      this.link = link;
      this.description = description;
      this.host = host;
    }
}
