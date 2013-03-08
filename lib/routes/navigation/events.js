"use strict"

module.exports = function (app) {
  app.get('/events', getEvents);
}

function getEvents (req, res) {
  res.render('events', { title: 'Upcoming Events'});
};