var Trip = require('../models/trip');
var User = require('../models/user');

exports.create = function(req, res, next){

    var email = req.user._doc.email;

    if(!email){
        return res.status(422).send({error: 'Not a valid token'});
    }

    User.findOne({email:email}, function(err, user){

        if(err){
          return next(err);
        }

        if(user){

            var trip = new Trip({
              start : req.body.start,
              end : req.body.end,
              distance : req.body.distance,
              options : req.body.options,
              user : {
                _id: user._id,
                picture: user.picture,
                fullName: user.fullName
              }
            });

            trip.save(function(err, tripSaved){

                if(err){
                     return next(err);
                }

                res.status(201).json({
                  message: "TRIP SAVED"
                });
            });

        }
    });

}

exports.myActiveTrips = function(req, res, next){

    var _id = req.user.id;

    if(!_id){
        return res.status(422).send({error: 'Not a valid token'});
    }

    function callback(err, trips){

        if(err){
            return next(err);
        }

        if(trips){
            res.status(201).json({
              trips:trips
            });
        }
    }

    Trip.find(
      {
          $or: [
              {'user._id':_id, finished:false},
              {passengers: { $elemMatch: {_id:_id} }}
          ]
      }).
      select('start end passengers options distance').
      exec(callback);


}

exports.nearTrips = function(req, res, next){

    var userId = req.user.id;
    var lat = parseFloat(req.body.lat);
    var lng = parseFloat(req.body.lng);

    var point = { type : "Point", coordinates : [lng,lat] };

    Trip.aggregate([
      {
        $geoNear: {
          near : point,
          maxDistance: 50000,
          distanceField: "dist.calculated",
          distanceMultiplier: 0.001,
          query: ({ "$and": [{ finished : false }, { "user._id": { "$ne": userId }}]}),
          spherical : true
        }
      }
    ],function(err, results) {

        if(err){
            return next(err);
        }

        if(results){
            res.status(201).json({
              trips:results
            });
        }


    });

}

exports.requestRide = function(req, res, next){

    var _id = req.user.id;
    var idTrip = req.body.trip;

    if(!_id){
        return res.status(422).send({error: 'Not a valid token'});
    }

    Trip.findOne({"$and":[{_id:idTrip},{"user._id":{"$ne":req.user._id}}]}, function(err, trip){

        if(err){
            return next(err);
        }

        if(!trip){
            return res.status(201).send({message: 'NOT TRIPS FOUND'});
        }

        Trip.findOne({"passengers._id":req.user._id}, function(err, alreadyInTrip){

            if(err){
                return next(err);
            }

            if(alreadyInTrip){
                return res.status(201).send({message: "ALREADY REQUESTED IN THIS TRIP"});
            }

            if(!(trip.passengersAccepted < trip.options.passengers)){
                return res.status(201).send({message : "THE TRIP IS FULL"})
            }

            trip.passengers.push(req.user);

            trip.save(function(err, tripSaved){

                if(err){
                    return next(err);
                  }

                res.status(201).json({
                  message: "REQUEST IN PROGRESS"
                });

            });


        })

    })

}
