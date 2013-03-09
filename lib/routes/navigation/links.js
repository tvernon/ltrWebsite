"use strict"

module.exports = function (app) {
  app.get('/links', getLinks);
}

function getLinks (req, res) {
  res.render('links', { title: 'Links', user: req.session.user});
};