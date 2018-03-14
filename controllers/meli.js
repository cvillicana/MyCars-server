var meli            = require('mercadolibre'),
 meliCredentials = require('../config/meli'),
 meliObject = new meli.Meli(meliCredentials.clientId, meliCredentials.clientSecret);

exports.categories = function(req, res, next){
  meliObject.get('categories/MLA1744', function (error, response) {
    if(error){
      return next(error);
    }

    res.status(200).json({
      categories:response
    });

  });

}
