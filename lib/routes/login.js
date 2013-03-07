"use strict"

module.exports = function (app) {
  app.get('/login', getLogin);
}

function getLogin (req, res) {
  res.render('login', { title: 'Login'});
};