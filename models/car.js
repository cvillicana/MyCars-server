var mongoose = require('mongoose');

class Car{

}

var CarSchema = new mongoose.Schema({

      make: {
          type: String,
          required: true
      },
      model: {
          type: String,
          required: true
      },
      version: {
          type: String,
          required: true
      },
      price:{
        type: String,
        required: true
      },
      kilometer:{
        type: String
      },
      other:{
        type: String
      },
      transmission:{
        type: String
      },
      gas:{
        type: String
      },
      contactPhone:{
        type: String
      },
      ownerName:{
        type: String
      },
      _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      pictures: [{
        type: String
      }]

    },
    {
      timestamps: true,
      usePushEach: true
    }
  );

CarSchema.loadClass(Car);

module.exports = mongoose.model('Car', CarSchema);
