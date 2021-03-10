module.exports = function(app){
  var authData = {
    email: 'egoing777@gmail.com',
    password: '111111',
    nickname: 'egoing'
  }
  
  var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
  // 세션기반으로 사용하므로 세션을 정의한 후 require한다.
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser(function(user, done){
    done(null, user.email);
  });
  passport.deserializeUser(function(id, done){
    done(null, authData);
  });
  
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
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
  return passport;
}