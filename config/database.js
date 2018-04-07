module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'dev':
      return{
        'url': 'mongodb://54.144.106.244:27017/carshare-dev',
        options : {
          useMongoClient: true,
          user: 'carsharedba',
          pass: 'carshare123'
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
