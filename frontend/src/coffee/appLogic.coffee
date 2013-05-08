define 'appLogic', ['jquery','underscore','backbone', 'soundManager'],
($, _, Backbone, SoundMan) ->

  appLogic =
    debug: true
    root: '/'
    rootURL: document.location.protocol + '//' + document.location.host
    vk:
      app_id: '3410757'
      secire_key: 'kZ41aLiatYNmn8JSZxYH'
      access_token: window.localStorage.getItem('access_token')
      user_id: window.localStorage.getItem('user_id')
      baseurl: 'https://api.vk.com/method/'
    lastfm:
      url: 'http://ws.audioscrobbler.com/2.0/'
      api_key: 'c1c6fd197f66044294bd73a350345a6d'
      secret: '825bc2441bbbdaf88f29e8d4fce8552f'
    views: {}
    trackListList: {}
    collections: []
    models: {}
    player:
      man: null
      currSong: null
    log: ->
      window.console.log arguments if appLogic.debug && window.console?

    start: ->
      if this.vk.user_id == null || this.vk.access_token == null
        this.authVK()
      else
        this.init()
      @

    init: ->
      require ['views/layout'], (Layout) ->
        appLogic.views.layout = new Layout el: document.getElementById 'app'

        appLogic.on 'list.load', appLogic.methods.loadList
        appLogic.on 'list.kill', appLogic.methods.killList
        appLogic.on 'list.loaded', appLogic.methods.showTrackList

        appLogic.on 'track.search', appLogic.methods.searchTrack
        appLogic.on 'track.play', appLogic.methods.playTrack
        appLogic.on 'track.setActive', appLogic.methods.currentTrack.set

        appLogic.trigger 'list.load', type: 'my'

        SoundMan.setup
          url: '/vendor/soundmanager/soundmanager2.swf'
          onready: ->
            appLogic.player.man = SoundMan if appLogic.player.man is null
            require ['views/player/playerView'], (PlayerView) ->
              appLogic.views.player = new PlayerView()
      @
    authVK: ->
      appLogic.navigate 'landing', trigger: true
      @

    methods:
      decodeStr: (encodedStr) ->
        $("<div/>").html(encodedStr).text()

      messages:
        timer: null
        show: (type, text) ->
          setTimeout ->
            $("#messages").html(text).attr('class', 'msg ' + type).addClass('visible')
          , 0
          @

        hide: ->
          clearTimeout appLogic.methods.messages.timer if appLogic.methods.messages.timer?

          appLogic.methods.messages.timer = setTimeout ->
            $("#messages").removeClass 'visible'
          , 1000
          @
        auto: (type, text) ->
          appLogic.methods.messages.show type, text
          appLogic.methods.messages.hide();
          @
      currentTrack:
        current: null,
        set: (data) ->
          if appLogic.methods.currentTrack.current isnt data.view
            if appLogic.methods.currentTrack.current?
              appLogic.methods.currentTrack.current.toggleActive()

            appLogic.methods.currentTrack.current = data.view
            appLogic.methods.currentTrack.current.toggleActive()
          @
      playTrack: (data) ->
        appLogic.log 'appLogic: playTrack: ', data

        if data.url?
          appLogic.player.currSong.destruct() if appLogic.player.currSong isnt null
          appLogic.player.currSong = appLogic.player.man.createSound
            id: 'test'
            url: data.url

            autoLoad: true
            autoPlay: true
            whileloading: ->
              appLogic.views.player.setLoadData @
            whileplaying: ->
              appLogic.views.player.setPlayingProgress @
            onfinish: ->
              appLogic.views.player.playingFinished @

          appLogic.player.currSong.play()
          appLogic.views.player.startedPlaying(data)

        @
      searchTrack: (params) ->
        appLogic.log 'appLogic: searchTrack: ', params

        params.$domElement = $ "#search-mp3-list"
        params.listTitle = 'Variants of "' + params.artist + " - " + params.title + '"'

        require ['collections/vkSongs'], (SongsCollection) ->
          vkSongs = new SongsCollection method: params.method
          vkSongs.fetch
            dataType: 'jsonp'
            data:
              access_token: appLogic.vk.access_token
              uid: appLogic.vk.user_id
              method: 'audio.search'
              q: params.artist + ' - ' + params.title
            success: (collection) ->
              params.$domElement.html ''
              appLogic.trigger 'list.loaded', data: params, collection: collection

          appLogic.collections.push vkSongs
        @
      loadVkTracksList: (params) ->
        appLogic.log 'appLogic: loadVkTracksList: ', params

        params.$domElement = $ '#track-lists-wrapper'
        params.listTitle = 'My Tracklist'

        require ['collections/vkSongs'], (SongsCollection) ->
          vkSongs = new SongsCollection method: params.method
          vkSongs.fetch
            dataType: 'jsonp'
            data:
              uid: appLogic.vk.user_id
              access_token: appLogic.vk.access_token

            error: (jqXHR, textStatus, errorThrown) ->
              appLogic.log(jqXHR, textStatus, errorThrown);

            success: (collection, response) ->
              appLogic.messages.auto response.error.error_msg if response.error
              appLogic.trigger 'list.loaded', data: params, collection: collection

          appLogic.collections.push vkSongs
        @
      loadSimilarTracksList: (params) ->
        appLogic.log 'appLogic: loadSimilarTracksList: ', params
        require ['collections/lastfmSongs'], (LastCollection) ->
          collection = new LastCollection();
          collection.fetch
            data:
              track: params.title
              artist: params.artist
              autocorrect: 1
              format: 'json'
              method: 'track.getsimilar'
              api_key: appLogic.lastfm.api_key

            success: (collection, response) ->
              if response.similartracks? and response.similartracks['#text'] is undefined
                appLogic.trigger 'list.loaded', data: params, collection: collection
              else
                appLogic.methods.messages.auto 'red', 'Similar tracks not found.'

          appLogic.collections.push(collection);
        @
      loadList: (params) ->
        appLogic.log 'appLogic: loadList: ', params

        params.type = 'lastfm' if params.type is null

        switch params.type
          when "my", "vk" then appLogic.methods.loadVkTracksList params
          when "lastfm", "search" then appLogic.methods.loadSimilarTracksList params
          else alert 'No spec'
        @

      # Event: list.loaded
      # When List is loaded and data recieved.
      # This function will decide which type of list to load and display by
      # `params.data.type` value

      showTrackList: (params) ->
        appLogic.log 'appLogic: showTrackList: params: ', params

        require ['views/tracksList/' + params.data.type + 'TracksList'], (ListView) ->
          params.el = params.data.$domElement[0]
          list = new ListView params
          appLogic.views[list.cid] = list
        @
      killList: (cid) ->
        appLogic.log "appLogic: killList: cid: ", cid
        list = appLogic.views[cid]
        list.$el.undelegate()
        list.$el.html('')
        delete appLogic.views[cid]
        @