define 'views/player/playerView',
['app','jquery','underscore','backbone','text!templates/player/player.html'],
  (app, $, _, Backbone, html) ->

    Backbone.View.extend
      el: $ "#app-header #player"
      template: _.template html

      events:
        'click .icon-play': 'playSong'
        'click .icon-pause': 'pauseSong'

      initialize: ->
        _.bindAll this, 'render', 'playSong', 'pauseSong'

        $(this.el).html @template
        @wrapper = @$el.find '#player-wrapper'
        @titleLabel = @$el.find '#player-wrapper #label'
        @timeLabel = @$el.find '#player-wrapper #time'
        @loadingProgress = @$el.find '#player-wrapper #load-progress'
        @playingProgress = @$el.find '#player-wrapper #play-progress'
        @tick = @$el.find '#player-wrapper #tick'

      playSong: ->
        @wrapper.addClass 'playing'
        app.player.currSong.play()

      pauseSong: ->
        @wrapper.removeClass 'playing'
        app.player.currSong.pause()

      startedPlaying: (data) ->
        @titleLabel.text data.title
        @wrapper.addClass 'playing'

      setLoadData: (data) ->
        seconds = Math.floor (data.durationEstimate / 1000) % 60
        minutes = Math.floor (data.durationEstimate / (60 * 1000)) % 60
        loadProgress = Math.floor (data.bytesLoaded * 100) / data.bytesTotal

        @timeLabel.text minutes + ':' + seconds
        @loadingProgress.css 'width', loadProgress + '%'

      setPlayingProgress: (data) ->
        playProgress = Math.floor data.position / data.duration * 100
        @playingProgress.css 'width', playProgress + '%'
        @tick.css 'left', playProgress + '%'