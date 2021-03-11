var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var lowdb = low(adapter);

lowdb.defaults({users:[]}).write();

module.exports = lowdb;