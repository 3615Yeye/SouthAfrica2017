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
  knex('stopovers').orderBy('sorting', 'asc').then(function(rows) {
    res.send(
      JSON.stringify(rows)
    );
  });
};

exports.new = function(req, res){
  // Start with a max value search of stopovers and otherwise start with 1
  knex('stopovers').max('sorting as maxSorting').then(function(rows) { 
    var maxSorting = rows[0].maxSorting;

    // maxSorting is null when the stopovers table is empty, so we make it start at 0
    if (maxSorting === null)
      maxSorting = 0;
    else
      maxSorting++;

    // Fake data until everything is supported 
    knex('stopovers')
      .returning(['id','title', 'description'])
      .insert({
        title: req.body.title,
        description: req.body.description,
        sorting: maxSorting,
        polyline: 'Hey',
        startLat: 47.1234,
        startLng: 7.1234,
        endLat: 48.1234,
        endLng: 8.1234,

      })
      .then(function(rows) {
        // Sending back the list of stopovers after inserting the new value
        knex('stopovers').then(function(rows) {
          res.send(
            JSON.stringify(rows)
          );
        })
      });
  });

};

exports.delete = function(req, res){
  var id = req.body.id;
  var sorting = req.body.sorting;

  // Deleting the stopover by id
  knex('stopovers')
    .where('id', id)
    .del()
    .then(function(rows) {
      // Decreasing sorting value by 1 for every stopover having a bigger value
      knex('stopovers')
        .where('sorting', '>', sorting)
        .decrement('sorting', 1)
        .then(function(rows) {
          // Sending back the list of stopovers after inserting the new value
          knex('stopovers').orderBy('sorting', 'asc').then(function(rows) {
            res.send(
              JSON.stringify(rows)
            );
          })
        });
    });
};

exports.update = function(req, res){
  var id = req.body.id;
  var title = req.body.title;
  var description = req.body.description;

  knex('stopovers')
    .where('id', id)
    .update({
        title: title,
        description: description
    })
    .then(function(rows) {
      // Sending back the list of stopovers after inserting the new value
      knex('stopovers').orderBy('sorting', 'asc').then(function(rows) {
        res.send(
          JSON.stringify(rows)
        );
      })
    });
};

exports.updateSorting = function(req, res){
  var newSorting = req.body.newSorting;
  var oldSorting = req.body.oldSorting;

  // If newSorting < oldSorting then set to -1, and increment every sorting >= newSorting
  if (oldSorting > newSorting) {
    knex('stopovers')
      .where('sorting', oldSorting)
      .update({
        sorting: -1
      })
      .then(function() {
        // increment stuff
        knex('stopovers')
          .whereBetween('sorting', [newSorting, oldSorting])
          .increment('sorting', 1)
          .then(function() {
            // Sending back the list of stopovers after inserting the new value
            knex('stopovers')
              .where('sorting', -1)
              .update({
                sorting: newSorting
              })
              .then(function() {
                // Sending back the list of stopovers after inserting the new value
                knex('stopovers').orderBy('sorting', 'asc').then(function(rows) {
                  res.send(
                    JSON.stringify(rows)
                  );
                })
              });
          })
      });
  }
  // If newSorting > oldSorting then set to -1, and decrement every sorting between newSorting and oldSorting included
  if (newSorting > oldSorting) {
    knex('stopovers')
      .where('sorting', oldSorting)
      .update({
        sorting: -1
      })
      .then(function() {
        // increment stuff
        knex('stopovers')
          .whereBetween('sorting', [oldSorting, newSorting])
          .decrement('sorting', 1)
          .then(function() {
            // Sending back the list of stopovers after inserting the new value
            knex('stopovers')
              .where('sorting', -1)
              .update({
                sorting: newSorting
              })
              .then(function() {
                // Sending back the list of stopovers after inserting the new value
                knex('stopovers').orderBy('sorting', 'asc').then(function(rows) {
                  res.send(
                    JSON.stringify(rows)
                  );
                })
              });
          })
      });
  }
};
