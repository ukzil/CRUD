var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template.js');
var path = require('path');
var url = require('url');
var qs = require('querystring');
var auth = require('../lib/auth');

router.get('',function(request, response, next){
  if(!auth.authIsOwner(request, response)){
    response.redirect('/')
    return false;
  }
  db.query(`SELECT * FROM topic`, function(error,topics){
    db.query(`SELECT * FROM author`, function(error2, authors){
      var title = 'author';
      var list = template.list(topics);
      var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}
            <style>
                  table{
                      border-collapse: collapse;
                  }
                  td{
                      border:1px solid black;
                  }
            </style>
            <form action="/author/create_process" method="post">
              <p><input type="text" name="name" placeholder="name"></p>
              <p>
                <textarea name="profile" placeholder="profile"></textarea>
              </p>
              <p>
                <input type="submit" value="create">
              </p>
            </form>
            `,
            ``, auth.authStatusUI(request, response)
      );
      response.send(html);
    })
  });
})
router.post('/create_process', function(request, response){
  var post = request.body;
    db.query(`
      INSERT INTO author (name, profile) 
        VALUES(?, ?)`,
      [post.name, post.profile], 
      function(error, result){
        if(error){
          throw error;
        }
        response.redirect(`/author`);
      }
    )
  }); 

router.get('/update/:pageId', function(request, response){
  db.query(`SELECT * FROM topic`, function(error,topics){
    db.query(`SELECT * FROM author`, function(error2,authors){
      var filteredId = path.parse(request.params.pageId).base;
        db.query(`SELECT * FROM author WHERE id=?`,[filteredId], function(error3,author){
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
            <form action="/author/update_process" method="post">
                <p>
                    <input type="hidden" name="id" value="${filteredId}">
                </p>
                <p>
                    <input type="text" name="name" value="${author[0].name}" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                </p>
                <p>
                    <input type="submit" value="update">
                </p>
            </form>
            `,
            ``
            );
            response.send(html);
        });
      });
  });
})
  
router.post('/update_process', function(request, response){
  var post = request.body;
  db.query(`
    UPDATE author SET name=?, profile=? WHERE id=?`,
    [post.name, post.profile, post.id], 
    function(error, result){
      if(error){
        throw error;
      }
      response.redirect(`/author`);
    }
  )
});

router.post('/delete_process', function(request, response){
  // var body = '';
  // request.on('data', function(data){
  //     body = body + data;
  // });
  // request.on('end', function(){
  //     var post = qs.parse(body);
  var post = request.body;
  db.query(`DELETE FROM topic WHERE author_id=?`,[post.id], function(error1, result){
    if(error1){
      throw error1;
    }
    db.query(`
      DELETE FROM author WHERE id=?`,
      [post.id], 
      function(error2, result){
        if(error2){
          throw error2;
        }
        response.redirect('/author');
      }
    )
  })
});

module.exports = router;