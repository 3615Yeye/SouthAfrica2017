// Initializing DB with sqlite3 before populating it with Knex
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('server/db.sqlite');

db.serialize(function() {
      db.run(
        "CREATE TABLE IF NOT EXISTS stopovers " +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "title STRING, " +
        "description TEXT, " +
        "sorting INTEGER, " +
        "polyline TEXT, " +
        "startLat FLOAT, " +
        "startLng FLOAT, " +
        "endLat FLOAT, " +
        "endLng FLOAT " +
        ")");
});
db.close();

/* Knex create table example
knex.schema.createTable('users', function (table) {
  table.increments();
  table.string('name');
  table.timestamps();
})
*/

/*
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
      filename: "server/db.sqlite"
    }
});
knex.schema.createTableIfNotExists('stopovers', function (table) {
  table.increments();
  table.string('title');
  table.string('description');
  table.integer('sorting');
  table.timestamps();
});
*/
