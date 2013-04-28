define 'views/player/playerView',
['app','jquery','underscore','backbone','text!templates/player/player.html'],
  (app, $, _, Backbone, html) ->

    Backbone.View.extend
      el: $ "#app-header #player"
      template: _.template html

      events:
        'click .icon-play': 'playSong'
        'click .icon-pause': 'pauseSong'
        'click #progress': 'setPositionByClick'
        'mousedown #progress': 'dragTickStart'
        'mousemove #progress': 'dragTick'
        'mouseup #progress': 'dragTickStop'

      initialize: ->
        _.bindAll this, 'render', 'playSong', 'pauseSong'

        $(this.el).html @template
        @searching = false
        @wrapper = @$el.find '#player-wrapper'
        @titleLabel = @$el.find '#player-wrapper #label'
        @timeLabel = @$el.find '#player-wrapper #time'
        @progress = @$el.find '#progress'
        @loadingProgress = @$el.find '#player-wrapper #load-progress'
        @playingProgress = @$el.find '#player-wrapper #play-progress'
        @tick = @$el.find '#player-wrapper #tick'

      # Dragging mouse of progress bar
      dragTickStart: (e) ->
        if app.player.currSong isnt null
          @searching = true

        if e.buttons is 0
          return

        if e.buttons is 1
          @progress._startX = e.clientX
          @tick._startX = @tick.position().left

        document.onselectstart = ->
          return false
        e.currentTarget.ondragstart = ->
          return false

      dragTick: (e) ->
        if @searching
          if e.buttons is 0
            return

          _mouseOffset = e.clientX - @progress._startX
          _x = @tick._startX + _mouseOffset

          if _x >= 0 and _x < $("#progress").width()
            @tick.css 'left', _x

      dragTickStop: (e) ->
        @searching = false
        pos = Math.floor (((@tick.position().left * 100) / $("#progress").width()) * @duration) / 100
        pos = 0 if pos < 10
        app.player.currSong.setPosition pos

      # Clicking on progress bar
      setPositionByClick: (e) ->

        # Find real offset from left
        calcRealLeftOffset = (elem, v) ->
          v += elem.offsetLeft
          if elem.offsetParent isnt null
            calcRealLeftOffset elem.offsetParent, v
          else
            return v

        rofst = calcRealLeftOffset e.currentTarget, 0
        ofst = e.clientX - rofst

        @tick.css 'left', ofst

        pos = ofst * @duration / $("#progress").width()
        app.player.currSong.setPosition pos

      playSong: ->
        if app.player.currSong isnt null
          @wrapper.addClass 'playing'
          app.player.currSong.play()

      pauseSong: ->
        if app.player.currSong isnt null
          @wrapper.removeClass 'playing'
          app.player.currSong.pause()

      startedPlaying: (data) ->
        @titleLabel.text data.title
        @wrapper.addClass 'playing'

      setLoadData: (data) ->
        seconds = Math.floor (data.durationEstimate / 1000) % 60
        minutes = Math.floor (data.durationEstimate / (60 * 1000)) % 60
        loadProgress = Math.floor (data.bytesLoaded * 100) / data.bytesTotal

        minutes = '0' + minutes if minutes.toString().length is 1
        seconds = '0' + seconds if seconds.toString().length is 1

        @timeLabel.text minutes + ':' + seconds
        @loadingProgress.css 'width', loadProgress + '%'

      setPlayingProgress: (data) ->
        @duration = data.duration
        playProgress = Math.floor data.position * $("#progress").width() / data.duration
        @playingProgress.css 'width', playProgress + 'px'
        if @searching isnt true
          @tick.css 'left', playProgress + 'px'

      playingFinished: (data) ->
        @playingProgress.css 'width', 0
        @tick.css 'left', 0
        @wrapper.removeClass 'playing'