"use strict"

module.exports = function (app) {
  app.get('/', getHome);
}

function getHome (req, res) {
  res.render('home', { title: 'Home'});
}