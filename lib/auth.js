module.exports = {
  authIsOwner:function(request, response){
    if(request.session.is_logined){
      return true;
    }
    else{
      return false;
    }
  }, authStatusUI:function(request, response){
    var authStatusUI = '<a href="/cookie/login">login</a>';
    if(request.session.is_logined === true){
      authStatusUI = `${request.session.nickname} | <a href="/cookie/logout">logout</a>`;
    }
    return authStatusUI;
  }
}