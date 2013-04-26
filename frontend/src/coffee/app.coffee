define 'app', ['jquery','underscore','backbone', 'soundManager'],
($, _, Backbone, SoundMan) ->
  app = _.extend {}, Backbone.Events

  $.ajaxSetup
    beforeSend: ->
      app.methods.messages.show 'blue', 'Loading data...'
    complete: ->
      app.methods.messages.hide()

  app = _.extend app,
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

    log: ->
      window.console.log arguments if app.debug && window.console?

    views: {}
    trackListList: {}
    collections: []
    models: {}
    player:
      man: null
      currSong: null
    start: ->
      $(document).on "click", "a[href]:not([data-bypass])", (evt) ->
        href = prop: $(this).prop("href"), attr: $(this).attr("href")
        root = location.protocol + "//" + location.host + app.root;
        if href.prop.slice(0, root.length) == root
          evt.preventDefault();
          Backbone.history.navigate href.attr, true

      if this.vk.user_id == null || this.vk.access_token == null
        this.authVK()
      else
        this.init()

    init: ->
      Layout = require ['views/layout'], (Layout) ->
        app.views.layout = new Layout()
        app.views.layout.render()

        app.on 'list.load', app.methods.loadList
        app.on 'list.kill', app.methods.killList
        app.on 'list.loaded', app.methods.showTrackList

        app.on 'track.search', app.methods.searchTrack
        app.on 'track.play', app.methods.playTrack
        app.on 'track.setActive', app.methods.currentTrack.set

        app.trigger 'list.load', type: 'my'

        SoundMan.setup
          url: '/vendor/soundmanager/soundmanager2.swf'
          onready: ->
            app.player.man = SoundMan if app.player.man is null
            require ['views/player/playerView'], (PlayerView) ->
              app.views.player = new PlayerView()
              app.views.player.render()

    authVK: ->
      VkAuth = require ['models/vkAuth']
      app.models.auth = new VkAuth()

    methods:
      decodeStr: (encodedStr) ->
        $("<div/>").html(encodedStr).text()

      messages:
        timer: null
        show: (type, text) ->
          setTimeout ->
            $("#messages").html(text).attr('class', 'msg ' + type).addClass('visible')
          , 0

        hide: ->
          clearTimeout app.methods.messages.timer if app.methods.messages.timer?

          app.methods.messages.timer = setTimeout ->
            $("#messages").removeClass 'visible'
          , 1000

        auto: (type, text) ->
          app.methods.messages.show type, text
          app.methods.messages.hide();

      currentTrack:
        current: null,
        set: (data) ->
          if app.methods.currentTrack.current isnt data.view
            if app.methods.currentTrack.current?
              app.methods.currentTrack.current.toggleActive();

            app.methods.currentTrack.current = data.view;
            app.methods.currentTrack.current.toggleActive();

      playTrack: (data) ->
        app.log 'app: playTrack: ', data

        if data.url?
          app.player.currSong.destruct() if app.player.currSong isnt null
          app.player.currSong = app.player.man.createSound
            id: 'test'
            url: data.url
            autoLoad: true
            autoPlay: true

          app.player.currSong.play()
        @
      searchTrack: (params) ->
        app.log 'app: searchTrack: ', params

        params.$domElement = $ "#search-mp3-list"
        params.listTitle = 'Variants of "' + params.artist + " - " + params.title + '"'

        require ['collections/vkSongs'], (SongsCollection) ->
          vkSongs = new SongsCollection method: params.method
          vkSongs.fetch
            dataType: 'jsonp'
            data:
              access_token: app.vk.access_token
              uid: app.vk.user_id
              method: 'audio.search'
              q: params.artist + ' - ' + params.title
            success: (collection) ->
              params.$domElement.html ''
              app.trigger 'list.loaded', data: params, collection: collection

          app.collections.push vkSongs
        @
      loadVkTracksList: (params) ->
        app.log 'app: loadVkTracksList: ', params

        params.$domElement = $ '#track-lists-wrapper'
        params.listTitle = 'My Tracklist'

        require ['collections/vkSongs'], (SongsCollection) ->
          vkSongs = new SongsCollection method: params.method
          vkSongs.fetch
            dataType: 'jsonp'
            data:
              uid: app.vk.user_id
              access_token: app.vk.access_token

            error: (jqXHR, textStatus, errorThrown) ->
              app.log(jqXHR, textStatus, errorThrown);

            success: (collection, response) ->
              app.messages.auto response.error.error_msg if response.error
              app.trigger 'list.loaded', data: params, collection: collection

          app.collections.push vkSongs
        @
      loadSimilarTracksList: (params) ->
        app.log 'app: loadSimilarTracksList: ', params
        require ['collections/lastfmSongs'], (LastCollection) ->
          collection = new LastCollection();
          collection.fetch
            data:
              track: params.title
              artist: params.artist
              autocorrect: 1
              format: 'json'
              method: 'track.getsimilar'
              api_key: app.lastfm.api_key

            success: (collection, response) ->
              if response.similartracks? and response.similartracks['#text'] is undefined
                app.trigger 'list.loaded', data: params, collection: collection
              else
                app.methods.messages.auto 'red', 'Similar tracks not found.'

          app.collections.push(collection);
        @
      loadList: (params) ->
        app.log 'app: loadList: ', params

        params.type = 'lastfm' if params.type is null

        switch params.type
          when "my", "vk" then app.methods.loadVkTracksList params
          when "lastfm", "search" then app.methods.loadSimilarTracksList params
          else alert 'No spec'
        @
      # Event: list.loaded
      # When List is loaded and data recieved.
      # This function will decide which type of list to load and display by
      # `params.data.type` value

      showTrackList: (params) ->
        app.log 'app: showTrackList: params: ', params

        require ['views/tracksList/' + params.data.type + 'TracksList'], (ListView) ->
          list = new ListView params
          app.views[list.cid] = list
          list.render()
          params.data.$domElement.html('').append(list.$el)
        @
      killList: (cid) ->
        app.log "app: killList: cid: ", cid
        list = app.views[cid]
        list.$el.undelegate()
        list.$el.remove()
        delete app.views[cid]
        @
  return app;

requirejs ['app'], (app) ->
  app.start()