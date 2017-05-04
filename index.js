var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('admin/db.sqlite');
var bodyParser = require('body-parser');
var path = require('path');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 

app.get('/stopovers', function(req, res) {
    db.all("SELECT * FROM stopover", function(err, rows) {
        res.send(
            JSON.stringify(rows)
        );
    });
});

var stopoverController = require('./admin/controllers/stopoverController');

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin', express.static(__dirname + '/public/admin'));

app.get('/admin/stopover/list', stopoverController.list);
app.post('/admin/stopover/new', stopoverController.new);
app.post('/admin/stopover/delete', stopoverController.delete);

app.listen(4242, function() {
    console.log('CRUD app listening on port 4242.');
});
