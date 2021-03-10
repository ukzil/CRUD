var mysql = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'as132546',
  database : 'playlist'
});
db.connect();
module.exports = db;