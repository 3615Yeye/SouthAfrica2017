var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('server/db.sqlite');
var knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "server/db.sqlite"
  },
  useNullAsDefault: true
});
var bodyParser = require('body-parser');

// Registering session as authentified
exports.list = function(req, res){
  knex('stopovers').orderBy('sorting', 'asc').then(function(stopoversResult) {
    knex.select('galleries.*', 'galleries.path as imageUrl', 'galleries.description as caption')
      .from('stopovers')
      .leftJoin('galleries', 'stopovers.id', 'galleries.stopover_id')
      .orderBy('galleries.stopover_id')
      .orderBy('galleries.sorting')
      .then(function(rows) {
        // Transformation because stopoversResult from Knex can't be modified
        var stopovers = (JSON.parse(JSON.stringify(stopoversResult)));

        for (j = 0; j < rows.length; j++) {
          var currentId = rows[j].stopover_id;
          for (o = 0; o < stopovers.length; o++) {
            if (stopovers[o]['id'] === currentId) {
              if (!stopovers[o].hasOwnProperty('gallery'))
                stopovers[o]['gallery'] = [];
              
              stopovers[o]['gallery'].push(rows[j]);
              break;
            }
          }
        }

        res.send(
          JSON.stringify(
            {
              stopovers: stopovers,
            }
          )
        );
      });
  });
};

exports.adminList = function(req, res){
  knex('stopovers').orderBy('sorting', 'asc').then(function(stopoversResult) {
    knex.select('galleries.*')
      .from('stopovers')
      .leftJoin('galleries', 'stopovers.id', 'galleries.stopover_id')
      .orderBy('galleries.stopover_id')
      .orderBy('galleries.sorting')
      .then(function(rows) {
        // Transformation because stopoversResult from Knex can't be modified
        var stopovers = (JSON.parse(JSON.stringify(stopoversResult)));

        for (j = 0; j < rows.length; j++) {
          var currentId = rows[j].stopover_id;
          for (o = 0; o < stopovers.length; o++) {
            if (stopovers[o]['id'] === currentId) {
              if (!stopovers[o].hasOwnProperty('gallery'))
                stopovers[o]['gallery'] = [];
              
              stopovers[o]['gallery'].push(rows[j]);
              break;
            }
          }
        }

        res.send(
          JSON.stringify(
            {
              stopovers: stopovers,
            }
          )
        );
      });
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

    console.log(req.body);

    // Fake data until everything is supported 
    knex('stopovers')
      .returning(['id'])
      .insert({
        title: req.body.title,
        description: req.body.description,
        sorting: maxSorting,
        polyline: 'Hey',
        startLat: req.body.startLat,
        startLng: req.body.startLng,
        endLat: 48.1234,
        endLng: 8.1234,

      })
      .then(function(rows) {
        var stopoverId = rows[0];
        console.log("Gallery for stopover id : " + stopoverId);

        var galleries = req.body.gallery;
        for (i = 0; i < galleries.length; i++) {
          galleries[i]['stopover_id '] = stopoverId;
        }

        knex.insert(galleries)
        .into('galleries')
        .then(function(rows) {
          // Sending back the list of stopovers after inserting the new value
          knex('stopovers').then(function(rows) {
            res.send(
              JSON.stringify(rows)
            );
          })
        });
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

  knex('stopovers')
    .where('id', id)
    .update({
      title: req.body.title,
      description: req.body.description,
      startLat: req.body.startLat,
      startLng: req.body.startLng
    })
    .then(function(rows) {
      // Deleting the stopover by id
      knex('galleries')
        .where('stopover_id', id)
        .del()
        .then(function(rows) {
          // Sending back the list of stopovers after inserting the new value
          knex('stopovers').orderBy('sorting', 'asc').then(function(rows) {
            var galleries = req.body.gallery;
            for (i = 0; i < galleries.length; i++) {
              galleries[i]['stopover_id'] = id;
            }

            console.log(galleries);

            knex.insert(galleries)
              .into('galleries')
              .then(function(rows) {
                // Sending back the list of stopovers after inserting the new value
                knex('stopovers').then(function(rows) {
                  res.send(
                    JSON.stringify(rows)
                  );
                })
              });
          })
        });
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
