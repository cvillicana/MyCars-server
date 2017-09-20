var path    = require('path'),
  fs        = require('fs'),
  AWS       = require('aws-sdk');

AWS.config.loadFromPath('./config/aws.json');
var s3 = new AWS.S3();

exports.saveFile = function(req, res, next){

  var filename = req.params.filename;
  //todo change route to another carpet
  var pathFile = path.basename(req.params.filename);
  pathFile = path.resolve(__dirname, "files", pathFile);
  var dst = fs.createWriteStream(pathFile);
  req.pipe(dst);

  dst.on('drain', function(){
    console.log('drain', new Date());
    req.resume();
  });

  req.on('end', function(){
    uploadFile(pathFile,filename);
    res.send(200);
  });
}


function uploadFile(pathFile,filename){

  var stream;

  fs.readFile(pathFile, function read(err, data){

    if (err){
      console.error("unable to read: ",err);
    }

    stream = data;

    var params = {
      Body: stream,
      Bucket: "vamonos-app",
      Key: "profile-pictures/" + filename
    };

    s3.putObject(params, function(err, data){
      console.log(err, data);
    });

  });

}
