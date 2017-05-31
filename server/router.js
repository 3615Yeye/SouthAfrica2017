var multer   =  require( 'multer' );
var crypto   =  require( 'crypto' );
var mime   =  require( 'mime' );
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/img/tmp')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, raw.toString('hex') + '.' + mime.extension(file.mimetype));
    });
  }
});
var upload = multer({ storage: storage });

var stopoverController = require('./controllers/stopoverController');
var uploadController = require('./controllers/uploadController');

// Routes
module.exports = function(app){
  app.get('/stopover/list', stopoverController.list);
  app.get('/admin/stopover/list', stopoverController.adminList);
  app.post('/admin/stopover/new', stopoverController.new);
  app.post('/admin/stopover/update', stopoverController.update);
  app.post('/admin/stopover/updateSorting', stopoverController.updateSorting);
  app.post('/admin/stopover/delete', stopoverController.delete);

  app.post('/admin/upload/image', upload.single( 'file' ), uploadController.upload);
};
