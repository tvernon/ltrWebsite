'use strict'
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , ejs = require('ejs')
  , engine = require('ejs-locals');

var app = express();
var viewsPath = path.join(__dirname, '../web/views/templates');
app.configure(function(){
  app.engine('ejs', engine);
  app.set('port', process.env.PORT || 3000);
  app.set('views', viewsPath);
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, '../web/static')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/events', routes.events);
app.get('/gallery', routes.gallery);
app.get('/runningLog' , routes.runningLog);
app.get('/members' , routes.members);
app.get('/links' , routes.links);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
