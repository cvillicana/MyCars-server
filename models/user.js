var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

class User{
    get fullName() {
        return `${this.name.firstName} ${this.name.lastName}`;
    }
}

var UserSchema = new mongoose.Schema({

    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    name:{
        firstName:String,
        lastName:String
    },
    password: String,
    role: {
        type: String,
        enum: ['employee', 'manager', 'admin'],
        default: 'manager'
    },
    facebookId: {
      type: String,
      unique: false
    },
    picture: {
      type: String,
      default: 'https://s3-us-west-1.amazonaws.com/vamonos-app/default-pictures/profile-picture.png'
    }

}, {
    timestamps: true
});

UserSchema.loadClass(User);

UserSchema.pre('save', function(next){

    var user = this;
    var SALT_FACTOR = 5;

    if(!user.isModified('password')){
        return next();
    }


    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            user.password = hash;
            next();

        });

    });

});


UserSchema.methods.comparePassword = function(passwordAttempt, cb){

    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){

        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });

}

module.exports = mongoose.model('User', UserSchema);
