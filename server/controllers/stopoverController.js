var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('server/db.sqlite');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "server/db.sqlite"
  }
});
var bodyParser = require('body-parser');

// Registering session as authentified
exports.list = function(req, res){
  knex.select().table('stopover').then(function(rows) {
    res.send(
      JSON.stringify(rows)
    );
  });
};

exports.new = function(req, res){
  knex('stopover')
    .returning(['id','title', 'description'])
    .insert({
      title: req.body.title,
      description: req.body.description
    })
    .then(function(rows) {
      // Sending back the list of stopovers after inserting the new value
      knex.select().table('stopover').then(function(rows) {
        res.send(
          JSON.stringify(rows)
        );
      })
    });
};

exports.delete = function(req, res){
  var id = req.body.id;

  knex('stopover')
    .where('id', id)
    .del()
    .then(function(rows) {
      // Sending back the list of stopovers after inserting the new value
      knex.select().table('stopover').then(function(rows) {
        res.send(
          JSON.stringify(rows)
        );
      })
    });
};

exports.update = function(req, res){
  var id = req.body.id;
  var title = req.body.title;
  var description = req.body.description;

  console.log(req.body);

  knex('stopover')
    .where('id', id)
    .update({
        title: title,
        description: description
    })
    .then(function(rows) {
      // Sending back the list of stopovers after inserting the new value
      knex.select().table('stopover').then(function(rows) {
        res.send(
          JSON.stringify(rows)
        );
      })
    });
};
