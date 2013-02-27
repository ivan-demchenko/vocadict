/**
 * VK SONG MODEL
**/

define([
  // Deps
  'underscore',
  'backbone'
],
  function (_, Backbone) {

    var Model = Backbone.Model.extend({

      defaults: {
        "artist": "Unknown",
        "title": "Untitled",
        "url": "none",
        "aid": undefined,
        "oid": undefined,
        "owner_id": undefined,
        "isActive": false,
        "lyrics_id": undefined
      },

      getSimilarUrl: function () {
        return 'similar/' + this.get('artist') + '/' + this.get('title');
      },

      getTrackCreds: function () {
        return this.get('artist') + ' - ' + this.get('title');
      }

    });

    return Model;

  });