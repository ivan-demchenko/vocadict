/**
 * VK TRACK ITEM VIEW
 **/
define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Deps
  'app',

  // Template
  'text!templates/track/lastfmTrack.html'
],
  function ($, _, Backbone, app, html) {
    var View = Backbone.View.extend({
      tagName: 'section',
      className: 'item',

      initialize: function () {
        this.template = html;
        _.bindAll(this, 'selectMe', 'searchTrack', 'render');
      },

      events: {
        'click a': 'selectMe',
        'click header': 'reloadMe',
        'click .icon-search': 'searchTrack'
      },

      selectMe: function selectMe(e) {
        e.preventDefault();
        e.stopPropagation();

        app.log('lastfmTrack clicked: event', e);

        this.el = e.currentTarget;
        this.model.set('isActive', true);

        app.trigger('list.load', {
          artist: app.methods.decodeStr(this.model.get('artist').name),
          title: app.methods.decodeStr(this.model.get('name')),
          listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"',
          $domElement: $(e.currentTarget).closest('.track-line').next()
        });
      },

      reloadMe: function reloadMe(e) {
        e.stopPropagation();
      },

      searchTrack: function playTrack(e) {
        e.preventDefault();
        e.stopPropagation();

        app.log('lastfmTrack: searchTrack: model: ', this.model);

        app.trigger('track.search', {
          type: 'search',
          artist: app.methods.decodeStr(this.model.get('artist').name),
          title: app.methods.decodeStr(this.model.get('name'))
        });
      },

      render: function render() {
        var itemHTML = _.template(this.template, this.model.toJSON());
        $(this.el).append(itemHTML);
      }
    });

    return View;
  });