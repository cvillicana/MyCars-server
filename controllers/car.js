var User = require('../models/user');
var Car = require('../models/car');
var UploadService = require('../services/uploadService');
var mongoose = require('mongoose');

exports.saveCar = function(req, res, next){

  var email = req.user._doc.email;

  if(!email){
      return res.status(401).send({error: 'Not a valid token'});
  }

  User.findOne({email: email}, function(err, user){

      if(err){
          return next(err);
      }

      if(user){

        var car = new Car({
          make : req.body.make,
          model : req.body.model,
          version : req.body.version,
          _user : user._id,
          price : req.body.price
        });

        car.save(function(err, _car){

            if(err){
                 return next(err);
            }

            res.status(201).json({
              id: _car._id,
              message: "car saved",
              success: true
            });
        });
      }
  });

}

exports.myCars = function(req, res, next){

  var email = req.user._doc.email;

  if(!email){
      return res.status(401).send({error: 'Not a valid token'});
  }

  User.findOne({email: email}, function(err, user){

      if(err){
        return next(err);
      }

      if(user){
        Car.find({_user:user._id}, function(err, cars){

          if(err){
            return next(err);
          }

          if(!cars){
            return res.status(200).send({message: "You don't have any cars yet", success: false});
          }

          if(cars){

            var result = {
              success :true,
              data : cars
            }

            res.status(200).send(result);
          }

        });


      }

  });


}

exports.uploadImage = function(req, res, next){

  var email = req.user._doc.email;

  if(!email){
    return res.status(422).send({error: 'You must enter an email address'});
  }

  var filename = req.body.id + Date.now() + ".png";

  UploadService.uploadFile(req, filename, "car-images/"+req.body.id)
    .then((data) => {

      var pictureLocation = data.Location;
      var id = mongoose.Types.ObjectId(req.body.id);

      Car.findOne({_id:id}, function(err,car){

          if(err){
            return next(err);
          }

          car.pictures.push(pictureLocation);

          car.save(function (err, updatedUser){

            if(err){
              return next(err);
            }

            var result = {
              success: true,
              message: "Image uploaded"
            }

            res.status(200).send(result);

          });

      });

    })
    .catch((err) => res.status(400).send());

}
