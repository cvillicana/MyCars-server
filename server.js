var express      = require('express'),
  app            = express(),
  mongoose       = require('mongoose'),
  logger         = require('morgan'),
  bodyParser     = require('body-parser'),
  cors           = require('cors'),
  databaseConfig = require('./config/database'),
  router         = require('./app/routes');

mongoose.connect(databaseConfig.url);

app.listen(process.env.PORT || 8080);
console.log("App listening on port 8080");

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());

router(app);
