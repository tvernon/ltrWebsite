"use strict"

module.exports = function (app) {
  app.get('/members', getMembers);
  app.get('/profile/:username', getProfile)
}

function getMembers (req, res) {
  res.render('members', { title: 'Who we are'});
};

function getProfile (req, res) {
  var username = decodeURIComponent(req.params.username);
  if (req.session && req.session.user && username === req.session.user.username) {
    res.locals.userLookup = null;
    res.render('profile', {title: username + "'s Profile"});
  } else {
    req.app.getUser(username, function (err, user) {
      if (err) {

      }
      res.locals.userLookup = user;
      res.render('profile', {title: username + "'s Profile"});
    });
  }
}