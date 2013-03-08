"use strict"

module.exports = function (app) {
  app.get('/runningLog', getRunLog);
}

function getRunLog (req, res) {
  res.render('runningLog', { title: 'Running Log'});
};
