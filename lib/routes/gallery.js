"use strict"

module.exports = function (app) {
  app.get('/gallery', getGallery);
}

function getGallery (req, res) {
  res.render('gallery', { title: 'Gallery'});
};
