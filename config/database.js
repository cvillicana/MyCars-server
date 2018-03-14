module.exports = function(){
  switch(process.env.NODE_ENV){
    case 'dev':
      return{
        'url': 'mongodb://ds215019.mlab.com:15019/heroku_hfs9p9rt',
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
