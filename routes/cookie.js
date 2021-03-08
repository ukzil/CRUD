var express = require('express');
var router = express.Router();
var app = express();
var mysql = require('mysql');
var path = require('path');
var db = require('../lib/db');
var template = require('../lib/template');
var auth = require('../lib/auth');

var authData = {
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing'
}

router.get('/login', function(request, response){
  db.query(`SELECT * FROM topic`, function(err, topics){
    var title = 'WEB - create';
    var list = template.list(topics);
    var html = template.HTML(title, '', `
      <form action="/cookie/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>
    `, '', auth.authStatusUI(request, response));
    response.send(html);
  });
})

router.post('/login_process', function(request, response){
  var post = request.body;
  var email = post.email;
  var password = post.password;
  if(email === authData.email && password === authData.password){
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    request.session.save(function(){
      response.redirect('/');
    });
  } else{
    response.send('who?');
  }
})

router.get('/logout', function(request, response){
  request.session.destroy(function(err){
    response.redirect('/');
  })
})

module.exports = router;