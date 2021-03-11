var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
var path = require('path');
var db = require('../lib/db');
var template = require('../lib/template');
var auth = require('../lib/auth');
const passport = require('passport');
var shortid = require('shortid');
var lowdb = require('../lib/lowdb');

router.get('/register', function(request, response){
  db.query(`SELECT * FROM topic`, function(err, topics){
    var title = 'WEB - create';
    var list = template.list(topics);
    var html = template.HTML(title, '', `
      <form action="/regist/register_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="password" name="password2" placeholder="password"></p>
        <p><input type="text" name="displayName" placeholder="display name"></p>
        <p><input type="submit" value="register"></p>
      </form>
    `, '', auth.authStatusUI(request, response));
    response.send(html);
  });
})

router.post('/register_process',function(request, response){
  var post = request.body;
  var email = post.email;
  var password = post.password;
  var password2 = post.password2;
  var displayName = post.displayName;
  if(password !== password2){
    response.redirect('/regist/register');
  } else{
    var user = {
      id:shortid.generate(),
      email: email,
      password: password,
      displayName: displayName
    };
    lowdb.get('users').push(user).write();
    request.login(user, function(err){
      return response.redirect('/');
    })
  }
})

module.exports = router;