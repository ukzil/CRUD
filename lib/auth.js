module.exports = {
  authIsOwner:function(request, response){
    if(request.user){
      return true;
    }
    else{
      return false;
    }
  }, authStatusUI:function(request, response){
    var authStatusUI = '<a href="/cookie/login">login</a> | <a href="/regist/Register">Register</a>';
    if(this.authIsOwner(request, response)){
      authStatusUI = `${request.user.displayName} | <a href="/cookie/logout">logout</a>`;
    }
    return authStatusUI;
  }
}