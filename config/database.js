module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'dev':
      return{
        'url': 'mongodb://ds123084.mlab.com:23084/heroku_1jnd7ck6',
        options : {
          useMongoClient: true,
          user: 'carpooldb',
          pass: 'mI4v1LL1'
        }
      }
    case 'local':
      return{
        'url': 'mongodb://localhost:27017/CarShare',
         options : {
           useMongoClient: true,
           user: 'carsharedba',
           pass: '123'
         }
      }
  }
}
