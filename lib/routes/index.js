'use strict';

module.exports = function (app) {
  require('./navigation/about')(app);
  require('./navigation/events')(app);
  require('./navigation/gallery')(app);
  require('./navigation/home')(app);
  require('./navigation/links')(app);
  require('./navigation/join')(app);
  require('./navigation/login')(app);
  require('./navigation/members')(app);
  require('./navigation/runLog')(app);
};