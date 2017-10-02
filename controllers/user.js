var User = require('../models/user');
var UploadService = require('../services/uploadService');

exports.getMyUser = function(req, res, next){

    var email = req.user._doc.email;

    if(!email){
      return res.status(422).send({error: 'Not a valid token'});
    }

    User.findOne({email:email}, function(err,user){

      if(err){
        return next(err);
      }

      if(user){

        var result = {
          username: user.username,
          email: user.email,
          name : user.name,
          picture : user.picture
        }

        return res.status(200).send(result);
      }

    });

}

exports.updateMyUser = function(req, res, nex){

    var query = { email : req.user._doc.email };

    var update = req.body;

    if(update.password){
      delete update.password;
    }

    if(update.email){
      delete update.email;
    }

    User.findOne(query, function(err,user){

        if(err){
          return next(err);
        }

        user.set(update);

        user.save(function (err, updatedUser){

          if(err){
            return next(err);
          }

          var result = {
            name : updatedUser.name,
            picture : updatedUser.picture
          }

          res.status(200).send(result);

        });

    });
}

exports.uploadImage = function(req, res, next){

  var email = req.user._doc.email;

  if(!email){
    return res.status(422).send({error: 'You must enter an email address'});
  }

  var query = { email : req.user._doc.email };

  var filename = req.user._doc.name.firstName + req.user._doc.name.lastName + Date.now() + ".png";

  UploadService.uploadFile(req, filename, "profile-pictures")
    .then((data) => {

      var update = { picture : data.Location };

      User.findOne(query, function(err,user){

          if(err){
            return next(err);
          }

          user.set(update);

          user.save(function (err, updatedUser){

            if(err){
              return next(err);
            }

            var result = {
              picture : updatedUser.picture
            }

            res.status(200).send(result);

          });

      });

    })
    .catch((err) => res.status(400).send());

}
