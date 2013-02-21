/** LASTFM TRACKS LSIT VIEW
 *  This list can be closed
 *  It must be rendered in sub-view
 **/

define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Deps
  'app',
  'views/tracksList/prototype', // Prototype to extend from
  'views/track/lastfmTrack', // LastFM track view

  // Template
  'text!templates/tracksList/lastfmTracksList.html'
],
  function ($, _, Backbone, app, tracksListViewPrototype, TrackView, html) {

    var View = tracksListViewPrototype.extend({

      template: _.template(html),

      initialize: function () {
        app.log('myTrackList: init');
        tracksListViewPrototype.prototype.initialize.apply(this, arguments);
      },

      events: {
        'click .icon-remove': 'closeMe'
      },

      render: function render() {
        app.log('myTracksList: render: this', this);

        var docFrag = document.createDocumentFragment();

        this.collection.each(function (TrackModel) {
          if (TrackModel.get('artist') !== 'Unknown') {
            var view = new TrackView({ model: TrackModel });
            view.render();
            docFrag.appendChild(view.el);
          }
        });

        this.$el.find('div')[0].appendChild(docFrag);

        return this;
      },

      closeMe: function closeMe(e) {
        e.preventDefault();
        e.stopPropagation();
        var cid = this.$el.attr('id');
        this.$el.closest('.active').removeClass('active');
        app.methods.killList(cid);
      }

    });

    return View;
  });