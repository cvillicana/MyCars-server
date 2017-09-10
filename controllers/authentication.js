var jwt = require('jsonwebtoken');
var User = require('../models/user');
var authConfig = require('../config/auth');

function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}

function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        role: request.role
    };
}

exports.authFacebook = function(req, res, next){

  var email = req.body.email;
  var userId = req.body.userId;
  var picture = req.body.picture;
  var name = req.body.name;
  var password = req.body.password;

  if(!email){
      return res.status(422).send({error: 'You must enter an email address'});
  }

  if(!userId){
      return res.status(422).send({error: 'You must enter an user id'});
  }

  if(!password){
      return res.status(422).send({error: 'You must enter a password'});
  }

  User.findOne({email: email}, function(err, existingUser){

    if(err){
      return next(err);
    }

    if(existingUser){
      var userInfo = setUserInfo(existingUser);

      return res.status(200).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
      });
    }

    var user = new User({
      email: email,
      facebookId: userId,
      picture:picture,
      name:name,
      password:password
    });

    user.save(function(err, user){

      if(err){
        return next(err);
      }

      var userInfo = setUserInfo(user);

      res.status(201).json({
          token: 'JWT ' + generateToken(userInfo),
          user: userInfo
      });

    });

  });

}

exports.login = function(req, res, next){

    var userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });

}

exports.register = function(req, res, next){

    var email = req.body.email;
    var password = req.body.password;
    var name = req.body.name;

    if(!email){
        return res.status(422).send({error: 'You must enter an email address'});
    }

    if(!password){
        return res.status(422).send({error: 'You must enter a password'});
    }

    User.findOne({email: email}, function(err, existingUser){

        if(err){
            return next(err);
        }

        if(existingUser){
            return res.status(422).send({error: 'That email address is already in use'});
        }

        var user = new User({
            email: email,
            password: password,
            name: name
        });

        user.save(function(err, user){

            if(err){
                return next(err);
            }

            var userInfo = setUserInfo(user);

            res.status(201).json({
                token: 'JWT ' + generateToken(userInfo),
                user: userInfo
            })

        });

    });

}

exports.exists = function(req, res, next){
    var email = req.params.email;

    if(!email){
      return res.status(422).send({error: 'You must enter an email address'});
    }

    User.findOne({email:email}, function(err,existingUser){

      if(err){
        return next(err);
      }

      if(existingUser){
        return res.status(422).send({error: 'That email address is already in use'});
      }

      return res.status(201).json({
        exists: false
      });

    });

}

exports.roleAuthorization = function(roles){

    return function(req, res, next){

        var user = req.user;

        User.findById(user._id, function(err, foundUser){

            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }

            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }

            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Unauthorized');

        });

    }

}
