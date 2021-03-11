const lowdb = require('./lowdb'); //lowdb
const db = require('./db'); //mysql

module.exports = function(app){
  
  var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
  // 세션기반으로 사용하므로 세션을 정의한 후 require한다.
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function(user, done){
    console.log('11', user);
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done){
    var user = lowdb.get('users').find({id:id}).value();
    console.log('22', user);
    done(null, user);
  });
  
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      console.log('LocalStrategy', email, password);
      var user = lowdb.get('users').find({email:email, password:password}).value();
      if(user){
        return done(null, user, {
          message: 'Welcome.'
        })
      } else{
        return done(null, false, {
          message: 'Incorrect user infomation.'
        })
      }
    }
  ));
  return passport;
}