"use strict"

module.exports = function (app) {
  app.get('/login', getLogin);
  app.post('/login', postLogin);
}

function getLogin (req, res) {
  console.log(req.queryString);
  res.render('login', { title: 'Login'});
};

function postLogin (req, res) {
  checkLogin(req.body.email, req.body.password, function (err) {
    if (err) {
      if (err.message === "Incorrect password") {
        console.log("FLASH ERROR");
        return res.redirect('/login?name=incorrect');
      } else {
        return next(err);
      }
    }
    return res.redirect('/');
  });

};

function checkLogin (username, password, callback) {
  //GET THE USER PASSWORD
  var storedPassword = "pass";
  //Compute the hash of the password
  password = password;
  if (password === storedPassword) {
    callback(null);
  } else {
    callback(new Error("Incorrect password"));
  }
};