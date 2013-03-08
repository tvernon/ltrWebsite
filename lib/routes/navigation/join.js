"use strict";

module.exports = function (app) {
  app.get('/join', getRunLog);
  app.post('/join', postJoin);

};

function getRunLog (req, res) {
  res.render('join', { title: 'Sign Up'});
}

function postJoin (req, res) {
  req.app.createUser(req.body, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
}