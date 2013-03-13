"use strict";

module.exports = function (app) {
  app.get('/events', getEvents);
  app.get('/events/create', getCreateEvents);
  app.post('/events/create', postCreateEvent);
};

function getEvents (req, res) {
  gatherEvents(req, {}, function (err, events) {
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

function getCreateEvents (req, res) {
  res.render('createEvent', {title: 'Create Event'});
}

function postCreateEvent (req, res) {
  req.app.createEvent(req.body, function (err, result) {
    if (err) {
      console.log(err);
      return res.redirect('404');
    }
    return res.redirect('/events');
  });
}