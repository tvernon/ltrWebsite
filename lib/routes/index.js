'use strict';

module.exports = function (app) {
  require('./about')(app);
  require('./events')(app);
  require('./gallery')(app);
  require('./home')(app);
  require('./links')(app);
  require('./login')(app);
  require('./members')(app);
  require('./runLog')(app);
};