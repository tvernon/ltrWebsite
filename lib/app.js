'use strict';
var express = require('express')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs')
  , engine = require('ejs-locals')
  , redis = require('redis')
  , optimist = require('optimist')
  , connectRedis = require('connect-redis')
  , socketIo = require('socket.io')
  , SessionSockets = require('session.socket.io');


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
    default: "password"
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
var RedisStore = connectRedis(express);
var sessionStore = new RedisStore({client: redisConnection});
var cookieParser = express.cookieParser('secret');

app.configure(function () {
  app.engine('ejs', engine);
  app.set('port', process.env.PORT || 3000);
  app.set('views', viewsPath);
  app.set('view engine', 'ejs');
  app.use(cookieParser);
  app.use(express.session({ store: sessionStore, secret: 'secret' }));
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    res.locals.activeNav = 'home';
    //    res.locals.outputFlashes = outputFlashes.bind(null, req, res);
    return next();
  });
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '../web/static')));
  require('./routes')(app);

  // ADD LOCAL FUNCTIONS TO APP
  app.getUser = getUser;
  app.createUser = createUser;
});
var server = http.createServer(app);
app.socketIoApp = socketIo.listen(server);
var sessionSockets = new SessionSockets(app.socketIoApp, sessionStore, cookieParser);


app.configure('development', function () {
  app.use(express.errorHandler());
});

server.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});
sessionSockets.on('connection', function (err, socket, session) {
  console.log('socket connected ' + socket.id);
  //  subscribe('disconnect');
  //  subscribe('send message');
  //  function subscribe(evt) {
  //    socket.on(evt, app.emitSocketIo.bind(null, evt, socket, session));
  //  }
});

function getUser (userName, callback) {
  var key = "users:" + userName;
  redisConnection.hgetall(key, function (err, userJsonString) {
    if (err) {
      return callback(err);
    }
    if (!userJsonString) {
      return callback(new Error("User not found."));
    } else {
      return callback(null, userJsonString);
    }
  });
}

function createUser (userInfo, callback) {
  var key = "users:" + userInfo.username;
  redisConnection.hexists(key, "username", function (err, exists) {
    if (err) {
      callback(err);
    }
    if (!exists) {
      redisConnection.hmset(key, userInfo, callback);
    } else {
      callback(new Error("Username already used"));
    }
  });
}