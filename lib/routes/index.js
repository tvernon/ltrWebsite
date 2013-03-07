/*
 * GET home page.
 */

exports.index = function (req, res) {
  console.log("HELLO");
  res.render('home', { title: 'Home'});
};

/*
 * GET events page.
 */

exports.events = function (req, res) {
  res.render('events', { title: 'Upcoming Events'});
};

/*
 * GET gallery page.
 */

exports.gallery = function (req, res) {
  res.render('gallery', { title: 'Gallery'});
};

/*
 * GET about page.
 */

exports.about = function (req, res) {
  res.render('about', { title: 'Nien! non!'});
};

/*
 * GET runningLog page.
 */

exports.runningLog = function (req, res) {
  res.render('runningLog', { title: 'Running Log'});
};

/*
 * GET members page.
 */

exports.members = function (req, res) {
  res.render('members', { title: 'Who we are'});
};

/*
 * GET links page.
 */

exports.links = function (req, res) {
  res.render('links', { title: 'Links'});
};