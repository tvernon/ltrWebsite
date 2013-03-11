"use strict";

module.exports = function (app) {
  app.get('/events', getEvents);
};

function getEvents (req, res) {
  gatherEvents(req, {}, function (err, events) {
    console.log("GOT EVENTS", events);
    if (err) {
      console.log(err);
      res.redirect('/?SomethingBadHappened');
    }
    res.locals.events = events;
    res.render('events', { title: 'Events'});
  });

}

function gatherEvents (req, options, callback) {
  req.app.gatherEvents(options, callback);
}