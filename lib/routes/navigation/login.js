'use strict'
var crypto = require('crypto');

module.exports = function (app) {
  app.get('/login', getLogin);
  app.get('/logout', getLogout);
  app.post('/login', postLogin);
};

function getLogin (req, res) {
  var queryType = req.query.type;

  if (!queryType) {
    res.render('login', { title: 'Login'});
  } else if (queryType === 'incorrectPassword') {
    res.render('login', { title: 'Login failed - Invalid Password', error: queryType});
  } else if (queryType === 'userNotFound') {
    res.render('login', { title: 'Login failed - Invalid Username', error: queryType});
  } else {
    res.render('login', { title: 'Login - INVALID QUERY STRING'});
  }

}

function getLogout (req, res) {
  req.session.user = null;
  res.redirect('/login');
}

function postLogin (req, res) {
  req.app.getUser(req.body.email, function (err, user) {
    if (err) {
      if (err.message === "User not found.") {
        return res.redirect('/login?type=userNotFound');
      } else {
        return res.redirect('/login?type=unknownGetUserError');
      }
    }
    checkPassword(req.body.password, user.password, function (err) {
      if (err) {
        if (err.message === "Incorrect password") {
          return res.redirect('/login?type=incorrectPassword');
        } else {
          return res.redirect('/login?type=unknownCheckPasswordError');
        }
      }
      req.session.user = user;
      return res.redirect('/');
    });
  });
}

function checkPassword (password, storedUserPassword, callback) {
  //Compute the hash of the password
  hashPassword(password, function (hashedPassword) {
    console.log("HASHED PASSWORD", hashedPassword, "STORED PASSWORD", storedUserPassword);
    if (hashedPassword === storedUserPassword) {
      callback(null);
    } else {
      callback(new Error("Incorrect password"));
    }
  });
}

function hashPassword (originalPassword, callback) {
  callback(originalPassword);
}

function hashPassword (password, callback) {
  var md5 = crypto.createHash('md5');
  md5.update(password);
  callback(md5.digest('hex'));
}