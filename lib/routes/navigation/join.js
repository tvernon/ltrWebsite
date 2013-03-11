"use strict";

module.exports = function (app) {
  app.get('/join', getJoin);
  app.post('/join', postJoin);

};

function getJoin (req, res) {
  res.render('join', { title: 'Sign Up'});
}

function postJoin (req, res) {
  //Hash password before adding
  req.body.password = req.app.hashPassword(req.body.password);
  req.app.createUser(req.body, function (err) {
    if (err) {
      if (err.message === "Username already used") {
        res.redirect('/join');
      } else {
        console.log(err);
      }
    } else {
      req.session.user = req.body;
      res.redirect('/');
    }
  });
}