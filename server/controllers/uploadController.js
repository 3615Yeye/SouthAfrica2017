exports.upload = function(req, res){
  // Metadata about the uploaded file can now be found in req.file
  console.log(req.file);
  return res.status( 200 ).send( req.file );
};
