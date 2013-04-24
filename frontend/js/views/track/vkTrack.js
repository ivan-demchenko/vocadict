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
        _.bindAll(this, 'selectMe', 'playTrack', 'render', 'toggleActive');
      },

      events: {
        'click a': 'selectMe',
        'click .icon-play': 'playTrack'
      },

      selectMe: function selectMe(e) {
        e.preventDefault();
        e.stopPropagation();

        app.log('vkTrack clicked: event', e);

        app.trigger('list.load', {
          $domElement: $(e.currentTarget).parent().next(),
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

        app.trigger('track.setActive', {view: this});
      },

      toggleActive: function () {
        this.$el.toggleClass('active');
      },

      render: function render() {
        var itemHTML = _.template(this.template, this.model.toJSON());
        $(this.el).append(itemHTML);
      }
    });

    return View;
  });