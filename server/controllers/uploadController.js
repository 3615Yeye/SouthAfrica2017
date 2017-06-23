var sizeOf = require('image-size');

exports.upload = function(req, res){
  sizeOf(req.file.path, function (err, dimensions) {
    req.file.height = dimensions.height;
    req.file.width = dimensions.width;
    console.log(req.file);
    return res.status( 200 ).send( req.file );
  });
};
