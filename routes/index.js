
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
 * GET photos page.
 */

exports.photos = function(req, res){
  res.render('photos', { title: 'Photos'});
};

/*
 * GET about page.
 */

exports.about = function(req, res){
  res.render('about', { title: 'About Us'});
};