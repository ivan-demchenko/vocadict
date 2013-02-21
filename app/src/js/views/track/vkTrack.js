define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Deps
  'app',
  'views/track/prototype',

  // Template
  'text!templates/track/vkTrack.html'
],
  function ($, _, Backbone, app, trackViewPrototype, html) {

    var View = trackViewPrototype.extend({
      initialize: function () {
        this.template = html;
        trackViewPrototype.prototype.initialize.apply(this, arguments);
      },
      /**
       * Cliked on track's tag.
       **/
      selectMe: function (e) {
        app.log('vkTrack clicked');

        e.preventDefault();
        e.stopPropagation();

        trackViewPrototype.prototype.selectMe.apply(this, arguments);
        app.trigger('list.load', {
          $domElement: $(e.currentTarget).find('.sub-track'),
          artist: app.methods.decodeStr(this.model.get('artist')),
          title: app.methods.decodeStr(this.model.get('title')),
          listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"'
        });
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