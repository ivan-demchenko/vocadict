define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Deps
  'app',

  // Template
  'text!templates/track/vkTrack.html'
],
  function ($, _, Backbone, app, html) {
    var View = Backbone.View.extend({
      tagName: 'section',
      className: 'item',

      initialize: function () {
        this.template = html;
        _.bindAll(this, 'selectMe', 'playTrack', 'render');
      },

      events: {
        'click': 'selectMe',
        'click .icon-play': 'playTrack'
      },

      selectMe: function selectMe(e) {
        e.preventDefault();
        e.stopPropagation();

        app.log('vkTrack clicked');

        this.el = e.currentTarget;
        this.model.set('isActive', true);

        app.trigger('list.load', {
          $domElement: $(e.currentTarget).find('.sub-track'),
          artist: app.methods.decodeStr(this.model.get('artist')),
          title: app.methods.decodeStr(this.model.get('title')),
          listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"'
        });
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

      render: function render() {
        var itemHTML = _.template(this.template, this.model.toJSON());
        $(this.el).append(itemHTML);
      }
    });

    return View;
  });