/** APP
 **/
define([
  // Libs
  'jquery',
  'underscore',
  'backbone'
],
  function ($, _, BB) {

    var app = {};

    // Autoplay animation when data is been loading
    $.ajaxSetup({
      beforeSend: function () {
        app.methods.messages.show('blue', 'Loading data...');
      },
      complete: function () {
        app.methods.messages.hide();
      }
    });

    // Setups, methods, keys, etc...
    app = {
      debug: true,
      root: '/',
      rootURL: document.location.protocol + '//' + document.location.host,
      vk: {
        app_id: '3410757',
        secire_key: 'kZ41aLiatYNmn8JSZxYH',
        access_token: window.localStorage.getItem('access_token'),
        user_id: window.localStorage.getItem('user_id'),
        baseurl: 'https://api.vk.com/method/'
      },
      lastfm: {
        url: 'http://ws.audioscrobbler.com/2.0/',
        api_key: 'c1c6fd197f66044294bd73a350345a6d',
        secret: '825bc2441bbbdaf88f29e8d4fce8552f'
      },
      log: function () {
        if (app.debug && typeof window.console !== 'undefiend') {
          window.console.log.apply(this, arguments);
        }
      },
      views: {},
      trackListList: {},
      collections: [],
      models: {},
      playerObject: null,
      methods: {
        decodeStr: function (encodedStr) {
          return $("<div/>").html(encodedStr).text();
        },

        /**
         * 
         **/
        start: function start() {
          if (!app.vk.user_id || !app.vk.access_token) {
            this.authVK();
          } else {
            this.init();
          }
        },

        init: function () {
          app.on('list.load', this.loadList);
          app.on('list.kill', this.killList);
          app.on('list.loaded', this.showTrackList);

          app.on('track.search', this.searchTrack);
          app.on('track.play', this.playTrack);

          // Initial load user's track list from VK
          app.trigger('list.load', {type: 'my'});
        },

        authVK: function () {
          require(['models/vkAuth'], function (VkAuth) {
            var x = new VkAuth();
          });
        },

        messages: {
          timer: undefined,
          show: function (type, text) {
            $("#messages")
              .html(text)
              .attr('class', 'msg ' + type)
              .addClass('visible');
          },
          hide: function () {
            if (app.methods.messages.timer !== undefined) {
              clearTimeout(app.methods.messages.timer);
            }

            app.methods.messages.timer = setTimeout(function () {
              $("#messages").removeClass('visible');
            }, 1000);
          },
          auto: function (type, text) {
            app.methods.messages.show(type, text);
            app.methods.messages.hide();
          }
        },

        playTrack: function playTrack(data) {
          app.log('app: playTrack: ', data);
          if (app.playerObject === null) {
            app.playerObject = document.getElementById("mp3-player");
          }
          if (data.url === undefined) {
            $("#player small span").text(data.title);
            app.playerObject.SetVariable("player:jsStop", "");
            app.playerObject.SetVariable("player:jsUrl", data.url);
            app.playerObject.SetVariable("player:jsPlay", "");
          }
        },

        searchTrack: function searchTrack(params) {
          app.log('app: searchTrack: ', params);

          params.$domElement = $("#search-mp3-list");
          params.listTitle = 'Variants of "' + params.artist + " - " + params.title + '"';

          require(['app', 'collections/vkSongs'], function (app, SongsCollection) {
            var vkSongs = new SongsCollection({ method: params.method });
            vkSongs.fetch({
              type: 'get',
              crossDomain: true,
              dataType: 'jsonp',
              cache: false,
              data: {
                access_token: app.vk.access_token,
                uid: app.vk.user_id,
                method: 'audio.search',
                q: params.artist + ' - ' + params.title
              },
              success: function (collection) {
                $("#search-mp3-list").html('');
                app.trigger('list.loaded', {data: params, collection: collection});
              }
            });
            app.collections.push(vkSongs);
          });
        },

        loadVkTracklist: function loadVkTracklist(params) {
          app.log('app: loadVkTracklist: ', params);

          params.$domElement = $('#track-lists-wrapper');
          params.listTitle = 'My Tracklist';

          require(['app', 'collections/vkSongs'], function (app, SongsCollection) {
            var vkSongs = new SongsCollection({ method: params.method });
            vkSongs.fetch({
              type: 'get',
              crossDomain: true,
              dataType: 'jsonp',
              cache: false,
              data: {
                uid: app.vk.user_id,
                access_token: app.vk.access_token
              },
              error: function (jqXHR, textStatus, errorThrown) {
                app.log(jqXHR, textStatus, errorThrown);
              },
              success: function (collection, response) {
                if (response.error) {
                  app.messages.auto(response.error.error_msg);
                }
                app.trigger('list.loaded', {data: params, collection: collection});
              }
            });
            app.collections.push(vkSongs);
          });
        },

        loadSimilarTrackList: function loadSimilarTrackList(params) {
          require(['collections/lastfmSongs'], function (LastCollection) {
            var collection = new LastCollection();
            collection.fetch({
              data: {
                track: params.title,
                artist: params.artist,
                autocorrect: 1,
                format: 'json',
                method: 'track.getsimilar',
                api_key: app.lastfm.api_key
              },
              success: function (collection, response) {
                if (response.similartracks === undefined) {
                  if (response.similartracks['#text'] === undefined) {
                    app.trigger('list.loaded', {data: params, collection: collection});
                  } else {
                    app.methods.messages.auto('red', 'Similar tracks not found.');
                  }
                }
              }
            });
            app.collections.push(collection);
          });
        },

        loadList: function loadList(params) {
          app.log('app: loadList: ', params);

          if (params.type === undefined) {
            params.type = 'lastfm';
          }
          switch (params.type) {
          case "my":
          case "vk":
            app.methods.loadVkTracklist(params);
            break;
          case "lastfm":
            app.methods.loadSimilarTrackList(params);
            break;
          }
        },
        /**
         * Event: list.loaded
         * When List is loaded and data recieved.
         * This function will decide which type of list to load and display by
         * `params.data.type` value
         **/
        showTrackList: function showTrackList(params) {
          app.log('app: showTrackList: params: ', params);

          var listType = '';

          require(['views/tracksList/' + params.data.type + 'TracksList'], function (ListView) {
            var list = new ListView(params);
            app.views[list.cid] = list;
            list.render();
            params.data.$domElement.append(list.$el);
          });
        },

        killList: function killList(cid) {
          var list = app.views[cid];
          list.$el.undelegate();
          list.$el.remove();
          delete app.views[cid];
        }
      }
    };

    app = _.extend(app, BB.Events);
    window.app = app;
    return app;
  });