define('app', [
  // Libs
  'jquery',
  'underscore',
  'backbone'
],
  function ($, _, Backbone) {
    var app = _.extend({}, Backbone.Events);
    // Autoplay animation when data is been loading
    $.ajaxSetup({
      beforeSend: function () {
        app.methods.messages.show('blue', 'Loading data...');
      },
      complete: function () {
        app.methods.messages.hide();
      }
    });

    app = _.extend(app, {
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
          window.console.log(arguments);
        }
      },
      views: {},
      trackListList: {},
      collections: [],
      models: {},
      playerObject: null,
      start: function () {
        $(document).on("click", "a[href]:not([data-bypass])", function (evt) {
          var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
          var root = location.protocol + "//" + location.host + app.root;
          if (href.prop.slice(0, root.length) === root) {
            evt.preventDefault();
            Backbone.history.navigate(href.attr, true);
          }
        });

        (this.vk.user_id === null || this.vk.access_token === null) ? this.authVK() : this.init();
      },

      init: function () {
        require(['views/layout'], function (Layout) {
          app.views.layout = new Layout();
          app.views.layout.render();

          app.on('list.load', app.methods.loadList);
          app.on('list.kill', app.methods.killList);
          app.on('list.loaded', app.methods.showTrackList);

          app.on('track.search', app.methods.searchTrack);
          app.on('track.play', app.methods.playTrack);
          app.on('track.setActive', app.methods.currentTrack.set);

          app.trigger('list.load', {type: 'my'});
        });
      },

      authVK: function () {
        require(['models/vkAuth'], function (VkAuth) {
          var x = new VkAuth();
        });
      },
      methods: {
        decodeStr: function (encodedStr) {
          return $("<div/>").html(encodedStr).text();
        },
        messages: {
          timer: null,
          show: function (type, text) {
            $("#messages").html(text).attr('class', 'msg ' + type).addClass('visible');
          },
          hide: function () {
            if (app.methods.messages.timer !== null) {
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

        currentTrack: {
          current: null,
          set: function (data) {
            if (app.methods.currentTrack.current !== data.view) {
              if (app.methods.currentTrack.current !== null) {
                app.methods.currentTrack.current.toggleActive();
              }
              app.methods.currentTrack.current = data.view;
              app.methods.currentTrack.current.toggleActive();
            }
          }
        },

        playTrack: function playTrack(data) {
          app.log('app: playTrack: ', data);
          if (app.playerObject === null) {
            app.playerObject = document.getElementById("mp3-player");
          }
          if (data.url !== undefined) {
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

          require(['collections/vkSongs'], function (SongsCollection) {
            var vkSongs = new SongsCollection({ method: params.method });
            vkSongs.fetch({
              dataType: 'jsonp',
              data: {
                access_token: app.vk.access_token,
                uid: app.vk.user_id,
                method: 'audio.search',
                q: params.artist + ' - ' + params.title
              },
              success: function (collection) {
                params.$domElement.html('');
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

          require(['collections/vkSongs'], function (SongsCollection) {
            var vkSongs = new SongsCollection({ method: params.method });
            vkSongs.fetch({
              dataType: 'jsonp',
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
                  return;
                }
                return app.trigger('list.loaded', {data: params, collection: collection});
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
                if (response.similartracks !== undefined) {
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
          case "search":
            app.methods.loadSimilarTrackList(params);
            break;
          default:
            alert('No spec');
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

          require(['views/tracksList/' + params.data.type + 'TracksList'], function (ListView) {
            var list = new ListView(params);
            app.views[list.cid] = list;
            list.render();
            params.data.$domElement.html('').append(list.$el);
          });
        },

        killList: function killList(cid) {
          var list = app.views[cid];
          list.$el.undelegate();
          list.$el.remove();
          delete app.views[cid];
        }
      }
    });
    return app;
  });

requirejs(['app'], function (app) {
  app.start();
});