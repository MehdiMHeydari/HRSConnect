/* Routes */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/main', function(req, res, next) {
  res.render('index', {page:'Home', menuId:'home'});
});

router.get('/', function(req, res, next) {
  res.render('login', {page:'Login', menuId:'login'});
});


/* Get create page */
router.get('/submit', function(req, res, next) {
  res.render('submit', {page:'Submit', menuId:'submit'});
});

/* Get find page */
/*router.get('/find', function(req, res, next) {
  res.render('find', {page:'Find', menuId:'find'});
});*/


// close the database connection


router.get('/login', function(req, res, next){
  res.render('login', {page:'Login', menuId:'login'});
});

router.get('/register', function(req,res,next){
  res.render('register', {page:'Register', menuId:'register'});
});

module.exports = router;
