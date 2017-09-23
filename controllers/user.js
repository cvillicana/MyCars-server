var User = require('../models/user');

exports.getUser = function(req, res, next){

    var email = req.user._doc.email;

    if(!email){
      return res.status(422).send({error: 'You must enter an email address'});
    }

    User.findOne({email:email}, function(err,user){

      if(err){
        return next(err);
      }

      if(user){
        return res.status(200).send(user);
      }

    });

}

exports.updateUser = function(req, res, nex){

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

          res.status(200).send(updatedUser);

        });

    });
}
