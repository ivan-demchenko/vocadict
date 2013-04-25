define 'models/lastfmSong',
['app', 'backbone'],
(app, Backbone) ->
  Backbone.Model.extend
    defaults:
      name: "Unknown"
      artist:
        name: "Unknown"
        url: "http://www.google.com"
      isActive: false

    getSimilarUrl: ->
      'similar/' + this.get('artist').name + '/' + this.get('name');

    getTrackCreds: ->
      this.get('artist').name + ' - ' + this.get('name');