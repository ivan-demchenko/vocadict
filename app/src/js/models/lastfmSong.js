/**
 * VK SONG MODEL
**/

define([
  // Libs
  'underscore',
  'backbone'
],
  function (_, Backbone) {

    var Model = Backbone.Model.extend({

      defaults: {
        "name": "Unknown",
        "artist": {
          "name": "Unknown",
          "url": "http://www.google.com"
        },
        "isActive": false
      },

      getSimilarUrl: function () {
        return 'similar/' + this.get('artist').name + '/' + this.get('name');
      },

      getTrackCreds: function () {
        return this.get('artist').name + ' - ' + this.get('name');
      }

    });

    return Model;

  });