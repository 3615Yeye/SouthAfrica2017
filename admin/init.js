var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('admin/db.sqlite');
db.serialize(function() {
      db.run("CREATE TABLE IF NOT EXISTS stopover (id INTEGER PRIMARY KEY AUTOINCREMENT" +
              ", title STRING, description STRING)");
});
db.close();
