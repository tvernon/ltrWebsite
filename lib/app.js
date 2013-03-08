'use strict'
var express = require('express')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs')
  , engine = require('ejs-locals')
  , redis = require('redis')
  , optimist = require('optimist');

var args = optimist
  .alias('h', 'help')
  .alias('h', '?')
  .options('db-port', {
    string: true,
    describe: 'The port to find database on.',
    default: 6379
  })
  .options('db-host', {
    string: true,
    describe: 'The host to find database on.',
    default: "localhost"
  })
  .options('db-password', {
    string: true,
    describe: 'The database password.',
    default: "0d334f948ce4b644d47c9b7601a68712"
  })
  .argv;

if (args.help) {
  optimist.showHelp();
  return process.exit(-1);
}

var app = express();

var redisConnection;
redisConnection = redis.createClient(args['db-port'], args['db-host']);
if (args['db-password']) {
  redisConnection.auth(args['db-password'], function (err) {
    if (err) {
      console.log(err);
      process.exit();
    }
  });
}

var viewsPath = path.join(__dirname, '../web/views/templates');
app.configure(function () {
  app.engine('ejs', engine);
  app.set('port', process.env.PORT || 3000);
  app.set('views', viewsPath);
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '../web/static')));
  require('./routes')(app);

  // ADD LOCAL FUNCTIONS TO APP
  app.getUserPassword = getUserPassword;
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

function getUserPassword (userName, callback) {
  var key = "users:" + userName;
  redisConnection.hget(key, "password", function (err, password) {
    console.log(key, password);
    if (err) {
      return callback(err);
    }

    if (!password) {
      return callback(new Error("User not found."));
    } else {
      return callback(null, password);
    }
  });
}