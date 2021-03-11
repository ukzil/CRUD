var express = require('express');
var router = express.Router();
var path = require('path');
var db = require('../lib/db');
var template = require('../lib/template.js');
var auth = require('../lib/auth');

router.get('/create', function(request, response){
  if(!request.user){
    response.redirect('/')
    return false;
  }
  db.query(`SELECT * FROM topic`, function(err, topics){
    db.query(`SELECT * FROM author`, function(err, authors){
      var title = 'WEB - create';
      var list = template.list(topics);
      var html = template.HTML(title, list, `
        <form action="/topic/create_process" method="post">
          <p class="sing"><input type="text" name="title" placeholder="가수"></p>
          <p class="song">
            <textarea name="description" placeholder="노래"></textarea>
          </p>
          <p>
            ${template.authorSelect(authors)}
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '', auth.authStatusUI(request, response));
      response.send(html);
    })
  });
})

router.post('/create_process',function(request, response){
   var post = request.body;
   db.query(`
    INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [post.title, post.description, post.author], function(err, result){
      if(err){
        throw err;
      }
      response.redirect(`/topic/${result.insertId}`)
   })    
})


router.get('/update/:pageId', function(request, response){
  db.query(`SELECT * FROM topic`, function(err, topics){
    var filteredId = path.parse(request.params.pageId).base;
    if(err){
      throw err;
    }
    db.query(`SELECT * FROM topic WHERE id=?`,[filteredId], function(err2, topic){
      if(err2){
        throw err2;
      }
      db.query(`SELECT * FROM author`, function(err, authors){
        var list = template.list(topics);
        var html = template.HTML(topic[0].title, list,
          `
          <form action="/topic/update_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <p class="sing"><input type="text" name="title" placeholder="가수" value="${topic[0].title}"></p>
            <p class="song">
              <textarea name="description" placeholder="노래">${topic[0].description}</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, topic[0].author_id)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<p class="btn"><a href="/topic/create">create</a></p> <p class="btn"><a href="/topic/update/${filteredId}">update</a></p>`,
          auth.authStatusUI(request, response)
        );
        response.send(html);
      })
    });
  });
})

router.post('/update_process',function(request, response){
  var post = request.body;
  db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], function(err, result){
    if(err){
      throw err;
    }
    response.redirect(`/topic/${post.id}`)
  })
})

router.post('/delete_process', function(request, response){
  if(!request.user){
    response.redirect('/')
    return false;
  }
  var post = request.body;
  db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(err, result){
    if(err){
      throw err;
    }
    response.redirect('/');
  })
})  

router.get('/:pageId', function(request, response, next){
  if(!request.user){
    response.redirect('/')
    return false;
  }
  db.query(`SELECT * FROM topic`, function(err, topics){
    var filteredId = path.parse(request.params.pageId).base;
    if(err){
      throw err;
    }
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[filteredId], function(err2, topic){
      if(err2){
        throw err2;
      }
      var title = topic[0].title;
      var description = topic[0].description;
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `
        <h2>${title}</h2>${description}
        <p>by ${topic[0].name}</p>
        `,
        `<p class="btn"><a href="/topic/create">create</a></p>
          <p class="btn"><a href="/topic/update/${filteredId}">update</a></p>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${filteredId}">
            <input type="submit" value="delete">
          </form>
        `,
        auth.authStatusUI(request, response)
      );
      response.send(html);
    })
  })
});

module.exports = router;