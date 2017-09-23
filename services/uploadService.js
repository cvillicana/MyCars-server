var path    = require('path'),
  fs        = require('fs'),
  AWS       = require('aws-sdk');

AWS.config.loadFromPath('./config/aws.json');
var s3 = new AWS.S3();

exports.saveFile = function(req, filename, bucketKey){

  return new Promise((resolve,reject) => {
    var pathFile = path.basename(filename);
    pathFile = path.resolve(__dirname, "files", pathFile);
    var dst = fs.createWriteStream(pathFile);
    req.pipe(dst);

    dst.on('drain', function(){
      console.log('drain', new Date());
      req.resume();
    });

    req.on('end', function(){
      uploadFile(pathFile,filename,bucketKey)
        .then((data) => resolve(data));
    });
  });

}


function uploadFile(pathFile,filename,bucketKey){

  return new Promise((resolve, reject) => {

    var stream;

    fs.readFile(pathFile, function read(err, data){

      if (err){
        reject(err);
      }

      stream = data;

      var params = {
        Body: stream,
        Bucket: "vamonos-app",
        Key: bucketKey + "/" + filename
      };

      s3.upload(params, function(err, data){
        resolve(data);
      });

    });

  })


}
