"use strict";

module.exports = function (app) {
  app.get('/join', getRunLog);
  app.post('/join', postJoin);

};

function getRunLog (req, res) {
  res.render('join', { title: 'Sign Up', user: req.session.user});
}

function postJoin (req, res) {
  req.app.createUser(req.body, function (err) {
    if (err) {
      if (err.message === "Username already used") {
        res.render('join', { title: 'Sign Up'});
      } else {
        console.log(err);
      }
    } else {
      req.session.user = req.body;
      res.redirect('/');
    }
  });
}