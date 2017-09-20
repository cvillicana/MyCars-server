var User = require('../models/user');

exports.getUser = function(req, res, next){

    var email = req.user._doc.email;

    if(!email){
      return res.status(422).send({error: 'You must enter an email address'});
    }

    User.findOne({email:email}, function(err,existingUser){

      if(err){
        return next(err);
      }

      if(existingUser){
        return res.status(200).send("hello");
      }

    });

}
