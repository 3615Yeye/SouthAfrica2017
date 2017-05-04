var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('admin/db.sqlite');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');
var upload = multer( { dest: 'public/images/' } );

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

// Images upload
app.post('/admin/upload', upload.single( 'file' ), function(req, res, next){
    // Metadata about the uploaded file can now be found in req.file
    console.log(req.file);
    return res.status( 200 ).send( req.file );
});

app.listen(4242, function() {
    console.log('CRUD app listening on port 4242.');
});
