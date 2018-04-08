var express      = require('express'),
  app            = express(),
  mongoose       = require('mongoose'),
  logger         = require('morgan'),
  bodyParser     = require('body-parser'),
  cors           = require('cors'),
  databaseConfig = require('./config/database'),
  router         = require('./routes');

  console.log(process.env.NODE_ENV);

var connection = mongoose.connect(databaseConfig().url,databaseConfig().options);

connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function() {
  console.log("Connected correctly to db");
});

var port = process.env.PORT || 8080;

app.listen(port);
console.log("App listening on port: " + port);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());

router(app);
