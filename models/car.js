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
      _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
      pictures: [{
        type: String
      }]

    },
    {
      timestamps: true
    }
  );

CarSchema.loadClass(Car);

module.exports = mongoose.model('Car', CarSchema);
