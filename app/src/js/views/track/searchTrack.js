define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Deps
  'app',
  'views/track/prototype',

  // Template
  'text!templates/track/searchTrack.html'
],
  function ($, _, Backbone, app, trackViewPrototype, html) {

    var View = trackViewPrototype.extend({

      initialize: function () {
        this.template = html;
        trackViewPrototype.prototype.initialize.apply(this, arguments);
      },

      events: {
        'click .icon-heart': 'saveTrack',
        'click .icon-play': 'playTrack',
      },

      /**
       * Cliked on track's tag.
       **/
      saveTrack: function saveTrack() {
        app.log('track: saveTrack');

        app.trigger('track.save', this.model);
      },

      /**
       * Button Play clicked.
       **/
      playTrack: function playTrack(e) {
        app.log('vkTrack: playTrack');

        e.preventDefault();
        e.stopPropagation();

        app.trigger('track.play', {
          title: this.model.getTrackCreds(),
          url: this.model.get('url')
        });
      }
    });

    return View;
  });