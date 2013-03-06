
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('home', { title: 'Home'});
};

/*
 * GET events page.
 */

exports.events = function(req, res){
  res.render('events', { title: 'Upcoming Events'});
};

/*
 * GET gallery page.
 */

exports.gallery = function(req, res){
  res.render('gallery', { title: 'Gallery'});
};

/*
 * GET about page.
 */

exports.about = function(req, res){
  res.render('about', { title: 'About Us'});
};