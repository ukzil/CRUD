module.exports = {
  HTML:function(title, list, body, control, authStatusUI){
    return `
    <!doctype html>
    <html>
    <head>
      <title>playlist - ${title}</title>
      <meta charset="utf-8">
      <link rel="stylesheet" href="/css/1.css"> 
    </head>                                     
    <body> 
      <div id="container">
        ${authStatusUI}
        <h1><a href="/">PlayList</a></h1>
        ${list}
        ${control}
        ${body}
      </div>                                     
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<div id="list"><ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/topic/${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul></div>';
    return list;
  },authorSelect:function(authors, author_id){
    var tag='';
    var i = 0;
    while(i < authors.length){
      var selected = '';
      if(authors[i].id === author_id){
        selected = ' selected';
      }
      tag = tag + `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
      i++;
    }
    return `
    <select name="author">
      ${tag}
    </select>
    `
  }, authorTable:function(authors){
    var tag = '<table>';
      var i = 0;
      while(i < authors.length){
        tag += `
          <tr>
            <td>${authors[i].name}</td>
            <td>${authors[i].profile}</td>
            <td><a href="/author/update/${authors[i].id}">update</td>
            <td>
              <form action="/author/delete_process" method="post"">
                <input type="hidden" name="id" value="${authors[i].id}">
                <input type="submit" value="delete">
              </form>
            </td>
          </tr>
        `
        i++;
      }
      tag += '</table>';
      return tag;
  }
}
