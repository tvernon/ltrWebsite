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
  , SessionSockets = require('session.socket.io')
  , crypto = require('crypto');


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
      process.exit(-1);
    }
  });
}
redisConnection.on("error", function (err) {
  console.error("Redis error", err.stack);
});
redisConnection.on("end", function () {
});

var viewsPath = path.join(__dirname, '../web/views/templates');
var RedisStore = connectRedis(express);
var sessionStore = new RedisStore({client: redisConnection});
var cookieParser = express.cookieParser('secret');

app.configure(function () {
  app.engine('ejs', engine);

  app.use(express.static(path.join(__dirname, '/../web/static')));
  app.use(express.favicon('favicon.png'));

  app.set('port', process.env.PORT || 3000);
  app.set('views', viewsPath);
  app.set('view engine', 'ejs');
  app.use(cookieParser);
  app.use(express.session({ store: sessionStore, secret: 'secret' }));
  app.use(function (req, res, next) {
    res.locals.session = req.session;
    //    res.locals.outputFlashes = outputFlashes.bind(null, req, res);
    return next();
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  require('./routes')(app);
  app.use(app.router);

  // ADD LOCAL FUNCTIONS TO APP
  app.getUser = getUser;
  app.createUser = createUser;
  app.gatherProfiles = gatherProfiles;
  app.hashPassword = hashPassword;
  app.gatherEvents = gatherEvents;
  app.createEvent = createEvent;
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

function hashPassword (password) {
  var md5 = crypto.createHash('md5');
  md5.update(password);
  return md5.digest('hex');
}

function gatherEvents (options, callback) {
  var events = [];
  var searchString = options.searchString || "events:*";
  redisConnection.keys(searchString, function (err, keys) {
    if (keys.length === 0) {
      return callback(null, events);
    }
    keys.forEach(function (key, index) {
      redisConnection.hgetall(key, function (err, event) {
        events.push(event);
        if (index + 1 === keys.length) {
          return callback(null, events);
        }
      })
    });
  });
}

function gatherProfiles (options, callback) {
  var users = [];
  var searchString = options.searchString || "users:*";
  redisConnection.keys(searchString, function (err, keys) {
    if (keys.length === 0) {
      return callback(null, users);
    }
    keys.forEach(function (key, index) {
      redisConnection.hgetall(key, function (err, user) {
        users.push(user);
        if (index + 1 === keys.length) {
          return callback(null, users);
        }
      })
    });
  });
}

function createEvent (args, callback) {
  var name = args.eventName;
  var type = args.eventType;
  var date = args.eventDate;
  var time = args.hour + args.minute;
  if (args.meridian === 'PM') {
    time = convertTo24(time);
  }
  args.eventTime = time;
  args.attendees = "";
  delete args.hour;
  delete args.minute;
  delete args.meridian;

  var location = args.location;
  var key = "events:name-" + name + ":type-" + type + ":date-" + date + ":time-" + time + ":location-" + location;
  console.log(args);
  redisConnection.hmset(key, args, callback);
}

function convertTo24 (time) {
  var firstDigit = parseInt(time.charAt(0));
  var secondDigit = parseInt(time.charAt(1));
  secondDigit += 2;
  if (secondDigit > 10) {
    secondDigit -= 10;
    firstDigit += 2;
  } else {
    firstDigit += 1;
  }
  var hours = firstDigit * 10 + secondDigit;
  if (hours == 24) {
    hours = 0;
  }
  var newName = hours.toString() + time.substr(2);
  return newName;
}