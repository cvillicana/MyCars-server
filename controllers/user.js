var User = require('../models/user');

exports.getMyUser = function(req, res, next){

    var email = req.user._doc.email;

    if(!email){
      return res.status(422).send({error: 'You must enter an email address'});
    }

    User.findOne({email:email}, function(err,user){

      if(err){
        return next(err);
      }

      if(user){

        var result = {
          name : user.name,
          picture : user.picture,
          email : user.email
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
            picture : updatedUser.picture,
            email : updatedUser.email
          }

          res.status(200).send(result);

        });

    });
}
