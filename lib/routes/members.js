"use strict"

module.exports = function (app) {
  app.get('/members', getMembers);
}

function getMembers (req, res) {
  res.render('members', { title: 'Who we are'});
};