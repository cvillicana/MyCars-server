var path    = require('path'),
  fs        = require('fs'),
  AWS       = require('aws-sdk');

AWS.config.loadFromPath('./config/aws.json');

var s3 = new AWS.S3();

exports.uploadFile = function(req,filename,bucketKey){

  return new Promise((resolve, reject) => {

    var file = req.files[0];

    var stream;

    fs.readFile(file.path, function read(err, data){

      if (err){
        reject(err);
      }

      stream = data;

      var params = {
        Body: stream,
        Bucket: "carshare-app",
        Key: bucketKey + "/" + filename
      };

      s3.upload(params, function(err, data){
        resolve(data);
      });

    });

  })


}
