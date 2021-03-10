var express = require('express');
var app = express();
var session = require('express-session');
var template = require('./lib/template.js');
var path = require('path');
var bodyParser = require('body-parser');
var compression = require('compression');
var topicRouter = require('./routes/topic');
var authorRouter = require('./routes/author');
var cookieRouter = require('./routes/cookie');
var db = require('./lib/db');
var auth = require('./lib/auth');
// var FileStore = require('session-file-store')(session);
var LokiStore = require('connect-loki')(session);

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
  store: new LokiStore()
}))

var passport = require('./lib/passport')(app);

app.use('/topic', topicRouter);
app.use('/author', authorRouter);
app.use('/cookie', cookieRouter);

app.get('/', function(request, response){
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
