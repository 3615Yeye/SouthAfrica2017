var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('admin/db.sqlite');
var bodyParser = require('body-parser');

// Registering session as authentified
exports.list = function(req, res){
    db.all("SELECT * FROM stopover", function(err, rows) {
        res.send(
            JSON.stringify(rows)
        );
    });
};

exports.new = function(req, res){
    var title = req.body.title;
    var description = req.body.description;

    db.serialize(function() {
        db.run("INSERT INTO stopover (title, description) VALUES(\"" + title + "\", \"" + description + "\")")

        // Sending back the stopovers list
        db.all("SELECT * FROM stopover", function(err, rows) {
            res.send(
                JSON.stringify(rows)
            )
        });
    });
};

exports.delete = function(req, res){
    var id = req.body.id;

    db.serialize(function() {
        db.run("DELETE FROM stopover WHERE id=" + id)

        // Sending back the stopovers list
        db.all("SELECT * FROM stopover", function(err, rows) {
            res.send(
                JSON.stringify(rows)
            )
        });
    });
};
