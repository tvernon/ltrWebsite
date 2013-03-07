"use strict"

module.exports = function (app) {
  app.get('/about', getAbout);
}

function getAbout (req, res) {
  res.render('about', { title: 'About Us'});
}