define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Deps
  'app',

  // Template
  'text!templates/track/searchTrack.html'
],
  function ($, _, Backbone, app, html) {
    var View = Backbone.View.extend({
      tagName: 'section',
      className: 'item',

      events: {
        'click .icon-play': 'playTrack',
        'click .icon-heart': 'likeMe'
      },

      initialize: function () {
        this.template = html;
        _.bindAll(this, 'playTrack', 'likeMe', 'render');
      },

      playTrack: function playTrack(e) {
        e.preventDefault();
        e.stopPropagation();

        app.log('vkTrack: playTrack');

        app.trigger('track.play', {
          title: this.model.getTrackCreds(),
          url: this.model.get('url')
        });
      },

      likeMe: function likeMe(e) {
        app.trigger('track.likeMe', this.model);
      },

      render: function render() {
        var itemHTML = _.template(this.template, this.model.toJSON());
        $(this.el).append(itemHTML);
      }
    });

    return View;
  });