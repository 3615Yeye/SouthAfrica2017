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
      db.run(
        "CREATE TABLE IF NOT EXISTS galleries " +
        "(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
        "path STRING, " +
        "description TEXT, " +
        "credit TEXT, " +
        "stopover_id INTEGER, " +
        "sorting INTEGER " +
        ")");
});
db.close();
