define  'models/vkSong',
['app','backbone'],
  (app, Backbone) ->
    Backbone.Model.extend
      defaults:
        artist: "Unknown",
        title: "Untitled",
        url: "none",
        isActive: false

      getSimilarUrl: ->
          'similar/' + this.get('artist') + '/' + this.get('title');

      getTrackCreds: ->
          this.get('artist') + ' - ' + this.get('title');
