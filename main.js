var express = require('express');
var app = express();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var template = require('./lib/template.js');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');
var authorRouter = require('./routes/author');
var cookieRouter = require('./routes/cookie');
var db = require('./lib/db');
var auth = require('./lib/auth');

app.use(express.static('public')); //public = dir
// 지정된 디렉토리 제외하고 경로입력
// 해야 적용됨 ex) public = static지정
// 경로여서 제외하고 안의 css부터 입력해야함
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());

app.use(session({
  secret: 'adsfasdfasf@!@#asdf',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
app.use('/topic', topicRouter);
app.use('/author', authorRouter);
app.use('/cookie', cookieRouter);
/*
var authData = {
  email: 'egoing777@gmail.com',
  password: '111111',
  nickname: 'egoing'
}

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
// 세션기반으로 사용하므로 세션을 정의한 후 require한다.
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'passwd'
  },
  function(username, password, done) {
    console.log('LocalStrategy', username, password);
    if(username === authData.email){
      console.log(1);
      if(password === authData.password){
      console.log(2);
        return done(null, authData);
      } else{
      console.log(3);
        return done(null, false, {
          message: 'Incorrect password.'
        });
      }
    } else{
      console.log(4);
      return done(null, false, {
        message: 'Incorrect username.'
      });
    }
  }
));

app.post('/cookie/login_process',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/cookie/login'})
);
*/

app.get('/', function(request, response){
  console.log(request.session);
  db.query(`SELECT * FROM topic`, function(err, topics){
    var title = 'Welcome';
    var description = '';
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `
      <p id="author"><a href="/author">작성자 목록</a></p>
      <h2>${title}</h2>
      ${description}
      `,
      `<p class="btn"><a href="/topic/create">create</a><p>`,
      auth.authStatusUI(request, response)
    );
    response.send(html);
  })
});

app.use(function(req, res, next){
  res.status(404).send('Sorry cant find that!');
})

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something broke!');
})

app.listen(3000, function(){
  console.log()
});
