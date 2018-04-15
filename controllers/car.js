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
          price : req.body.price,
          shareId: Math.floor(Math.random() * (99999 - 10000) + 10000),
          contactPhone: req.body.contactPhone,
          ownerName: req.body.ownerName
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

exports.removeImage = function(req, res, next){

  var email = req.user._doc.email;

  var carId = req.params.id;

  var carImages = req.body.pictures;

  if(!email){
      return res.status(401).send({error: 'Not a valid token'});
  }

  User.findOne({email: email}, function(err, user){

      if(err){
          return next(err);
      }

      if(user){

        Car.findOne({_id:carId, _user: req.user}, function(err, car){

            if(err){
                return next(err);
            }

            if(!car){
                res.status(404).json({
                    success: false,
                    message: "car not found"
                });
            }

            car.pictures = carImages;


            car.save(function(err, _car){

              if(err){
                return next(err);
              }

              res.status(200).json({
                message: "picture removed",
                success: true
              });
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
              cars : cars
            }

            res.status(200).send(result);
          }

        });


      }

  });


}

exports.updateCarProperty = function(req, res, next){
  var email = req.user._doc.email;
  var carId = req.params.id;
  var toUpdate = req.body;

  if(!email){
      return res.status(401).send({error: 'Not a valid token'});
  }

  User.findOne({email: email}, function(err, user){

      if(err){
          return next(err);
      }

      if(user){

        Car.findOne({_id:carId, _user: req.user}, function(err, car){

            if(err){
                return next(err);
            }

            if(!car){
                res.status(404).json({
                    success: false,
                    message: "car not found"
                });
            }

            car.set(toUpdate);

            car.save(function(err, _car){

              if(err){
                return next(err);
              }

              res.status(200).json({
                message: "updated",
                success: true
              });
            });
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

exports.getCarByShareId = function(req, res, next){

  var shareId = req.params.id;

  if(!shareId){
    return res.status(400).send({error: 'Not a valid share id'});
  }

  Car.findOne({shareId: shareId})
      .populate({path: '_user', select: 'picture'})
      .exec(function(err, car){
        if(err){
          return next(err);
        }

        if(car){

            var result = {
              success :true,
              cars : car
            }

            res.status(200).send(result);

        }

      })
}
