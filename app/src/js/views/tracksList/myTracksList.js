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
  'views/tracksList/prototype',
  'views/track/vkTrack', // VKontakte track view

  // Template
  'text!templates/tracksList/myTracksList.html'
],
  function ($, _, Backbone, app, tracksListViewPrototype, TrackView, html) {

    var View = tracksListViewPrototype.extend({

        template: _.template(html),

        initialize: function () {
          app.log('myTrackList: init');
          tracksListViewPrototype.prototype.initialize.apply(this, arguments);
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
        }
      });

    return View;
  });