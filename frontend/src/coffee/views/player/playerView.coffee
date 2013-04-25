define 'views/player/playerView',
['app','jquery','underscore','backbone','text!templates/player/player.html'],
  (app, $, _, Backbone, html) ->

    Backbone.View.extend
      el: $ "#app-header #player"
      template: _.template html

      events:
        '#play-song click': 'playSong'
        '#stop-song click': 'stopSong'

      initialize: ->
        this.$el.attr 'class', 'flt-l'
        _.bindAll this, 'render'

      render: (data) ->
        $(this.el).html this.template data

      playSong: ->
        app.player.currSong.play()

      stopSong: ->
        app.player.currSong.stop()

      playFromURL: (URL) ->
        $(this.el).find("audio#player source").attr('src', URL);