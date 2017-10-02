var mongoose = require('mongoose');

class Trip{
    get passengersAccepted() {
        var accepted = 0;
        for(var i = 0, len = this.passengers.length; i < len; i ++){
          accepted = this.passengers[i].accepted === true ? accepted + 1 : accepted;
        }
        return accepted;
    }
}


var TripSchema = new mongoose.Schema({

    user: {
      _id: String,
      name: {
          firstName: String,
          lastName: String
      }
    },
    start: {
        city: String,
        placeId: String,
        location: {
          type: {
            type: String,
            default: "Point"
          },
          coordinates: [ Number, Number ]
        }
    },
    end: {
        city: String,
        placeId: String,
        location: {
          type: {
            type: String,
            default: "Point"
          },
          coordinates: [ Number, Number ]
        }
    },
    distance: Number,
    options: {
        passengers: Number,
        price: Number,
        date: Date
    },
    passengers: [
      {
        name: {
          firstName:String,
          lastName:String
        },
        accepted: Boolean,
        rate: Number,
        _id: String
      }
    ],
    finished: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

TripSchema.loadClass(Trip);

module.exports = mongoose.model('Trip', TripSchema);
