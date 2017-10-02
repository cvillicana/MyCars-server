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
              user : user
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
