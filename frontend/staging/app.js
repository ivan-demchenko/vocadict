define('app', ['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var app;

  app = _.extend({}, Backbone.Events);
  $.ajaxSetup({
    beforeSend: function() {
      return app.methods.messages.show('blue', 'Loading data...');
    },
    complete: function() {
      return app.methods.messages.hide();
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
    log: function() {
      if (app.debug && (window.console != null)) {
        return window.console.log(arguments);
      }
    },
    views: {},
    trackListList: {},
    collections: [],
    models: {},
    playerObject: null,
    start: function() {
      $(document).on("click", "a[href]:not([data-bypass])", function(evt) {
        var href, root;

        href = {
          prop: $(this).prop("href"),
          attr: $(this).attr("href")
        };
        root = location.protocol + "//" + location.host + app.root;
        if (href.prop.slice(0, root.length) === root) {
          evt.preventDefault();
          return Backbone.history.navigate(href.attr, true);
        }
      });
      if (this.vk.user_id === null || this.vk.access_token === null) {
        return this.authVK();
      } else {
        return this.init();
      }
    },
    init: function() {
      var Layout;

      return Layout = require(['views/layout'], function(Layout) {
        app.views.layout = new Layout();
        app.views.layout.render();
        app.on('list.load', app.methods.loadList);
        app.on('list.kill', app.methods.killList);
        app.on('list.loaded', app.methods.showTrackList);
        app.on('track.search', app.methods.searchTrack);
        app.on('track.play', app.methods.playTrack);
        app.on('track.setActive', app.methods.currentTrack.set);
        return app.trigger('list.load', {
          type: 'my'
        });
      });
    },
    authVK: function() {
      var VkAuth;

      VkAuth = require(['models/vkAuth']);
      return app.models.auth = new VkAuth();
    },
    methods: {
      decodeStr: function(encodedStr) {
        return $("<div/>").html(encodedStr).text();
      },
      messages: {
        timer: null,
        show: function(type, text) {
          return $("#messages").html(text).attr('class', 'msg ' + type).addClass('visible');
        },
        hide: function() {
          if (app.methods.messages.timer != null) {
            clearTimeout(app.methods.messages.timer);
          }
          return app.methods.messages.timer = setTimeout(function() {
            return $("#messages").removeClass('visible', 1000);
          });
        },
        auto: function(type, text) {
          app.methods.messages.show(type, text);
          return app.methods.messages.hide();
        }
      },
      currentTrack: {
        current: null,
        set: function(data) {
          if (app.methods.currentTrack.current !== data.view) {
            if (app.methods.currentTrack.current != null) {
              app.methods.currentTrack.current.toggleActive();
            }
            app.methods.currentTrack.current = data.view;
            return app.methods.currentTrack.current.toggleActive();
          }
        }
      },
      playTrack: function(data) {
        app.log('app: playTrack: ', data);
        app.playerObject = app.playerObject || document.getElementById("mp3-player");
        if (data.url != null) {
          $("#player small span").text(data.title);
          app.playerObject.SetVariable("player:jsStop", "");
          app.playerObject.SetVariable("player:jsUrl", data.url);
          return app.playerObject.SetVariable("player:jsPlay", "");
        }
      },
      searchTrack: function(params) {
        app.log('app: searchTrack: ', params);
        params.$domElement = $("#search-mp3-list");
        params.listTitle = 'Variants of "' + params.artist + " - " + params.title + '"';
        return require(['collections/vkSongs'], function(SongsCollection) {
          var vkSongs;

          vkSongs = new SongsCollection({
            method: params.method
          });
          vkSongs.fetch({
            dataType: 'jsonp',
            data: {
              access_token: app.vk.access_token,
              uid: app.vk.user_id,
              method: 'audio.search',
              q: params.artist + ' - ' + params.title
            },
            success: function(collection) {
              params.$domElement.html('');
              return app.trigger('list.loaded', {
                data: params,
                collection: collection
              });
            }
          });
          return app.collections.push(vkSongs);
        });
      },
      loadVkTracksList: function(params) {
        app.log('app: loadVkTracksList: ', params);
        params.$domElement = $('#track-lists-wrapper');
        params.listTitle = 'My Tracklist';
        return require(['collections/vkSongs'], function(SongsCollection) {
          var vkSongs;

          vkSongs = new SongsCollection({
            method: params.method
          });
          vkSongs.fetch({
            dataType: 'jsonp',
            data: {
              uid: app.vk.user_id,
              access_token: app.vk.access_token
            },
            error: function(jqXHR, textStatus, errorThrown) {
              return app.log(jqXHR, textStatus, errorThrown);
            },
            success: function(collection, response) {
              if (response.error) {
                app.messages.auto(response.error.error_msg);
              }
              return app.trigger('list.loaded', {
                data: params,
                collection: collection
              });
            }
          });
          return app.collections.push(vkSongs);
        });
      },
      loadSimilarTracksList: function(params) {
        app.log('app: loadSimilarTracksList: ', params);
        return require(['collections/lastfmSongs'], function(LastCollection) {
          var collection;

          collection = new LastCollection();
          collection.fetch({
            data: {
              track: params.title,
              artist: params.artist,
              autocorrect: 1,
              format: 'json',
              method: 'track.getsimilar',
              api_key: app.lastfm.api_key
            },
            success: function(collection, response) {
              if ((response.similartracks != null) && response.similartracks['#text'] === void 0) {
                return app.trigger('list.loaded', {
                  data: params,
                  collection: collection
                });
              } else {
                return app.methods.messages.auto('red', 'Similar tracks not found.');
              }
            }
          });
          return app.collections.push(collection);
        });
      },
      loadList: function(params) {
        app.log('app: loadList: ', params);
        if (params.type === null) {
          params.type = 'lastfm';
        }
        switch (params.type) {
          case "my":
          case "vk":
            return app.methods.loadVkTracksList(params);
          case "lastfm":
          case "search":
            return app.methods.loadSimilarTracksList(params);
          default:
            return alert('No spec');
        }
      },
      showTrackList: function(params) {
        app.log('app: showTrackList: params: ', params);
        return require(['views/tracksList/' + params.data.type + 'TracksList'], function(ListView) {
          var list;

          list = new ListView(params);
          app.views[list.cid] = list;
          list.render();
          return params.data.$domElement.html('').append(list.$el);
        });
      },
      killList: function(cid) {
        var list;

        app.log("app: killList: cid: ", cid);
        list = app.views[cid];
        list.$el.undelegate();
        list.$el.remove();
        return delete app.views[cid];
      }
    }
  });
  return app;
});

requirejs(['app'], function(app) {
  return app.start();
});

define('collections/lastfmSongs', ['app', 'jquery', 'underscore', 'backbone', 'models/lastfmSong'], function(app, $, _, BB, lastfmSongModel) {
  return BB.Collection.extend({
    url: app.lastfm.url,
    model: lastfmSongModel,
    parse: function(res) {
      if (res.error) {
        return app.methods.messages.auto('red', res.message);
      } else {
        return res.similartracks.track;
      }
    }
  });
});

define('collections/vkSongs', ['app', 'jquery', 'underscore', 'backbone', 'models/vkSong'], function(app, $, _, BB, vkSongModel) {
  return BB.Collection.extend({
    method: 'audio.get',
    model: vkSongModel,
    url: function() {
      return app.vk.baseurl + this.method;
    },
    initialze: function(data) {
      return this.method = data.method;
    },
    parse: function(res) {
      var data;

      return data = res.response;
    }
  });
});

define('models/lastfmSong', ['app', 'backbone'], function(app, Backbone) {
  return Backbone.Model.extend({
    defaults: {
      name: "Unknown",
      artist: {
        name: "Unknown",
        url: "http://www.google.com"
      },
      isActive: false
    },
    getSimilarUrl: function() {
      return 'similar/' + this.get('artist').name + '/' + this.get('name');
    },
    getTrackCreds: function() {
      return this.get('artist').name + ' - ' + this.get('name');
    }
  });
});

define('models/search', ['app', 'jquery', 'underscore', 'backbone'], function(app, $, _, Backbone, html) {
  return Backbone.Model.extend({
    defaults: {
      entryContent: ''
    }
  });
});

define('models/vkAuth', ['jquery', 'underscore', 'backbone', 'app'], function($, _, BB, app) {
  return BB.Model.extend({
    initialize: function() {
      var url;

      url = 'http://oauth.vk.com/authorize?' + 'client_id=' + app.vk.app_id + '&scope=audio,offline' + '&redirect_uri=' + app.rootURL + '/vkauth' + '&display=page' + '&response_type=token';
      return window.location.href = url;
    }
  });
});

define('models/vkSong', ['app', 'backbone'], function(app, Backbone) {
  return Backbone.Model.extend({
    defaults: {
      artist: "Unknown",
      title: "Untitled",
      url: "none",
      isActive: false
    },
    getSimilarUrl: function() {
      return 'similar/' + this.get('artist') + '/' + this.get('title');
    },
    getTrackCreds: function() {
      return this.get('artist') + ' - ' + this.get('title');
    }
  });
});

define('views/layout', ['jquery', 'underscore', 'backbone', 'app', 'views/search/form', 'text!templates/layout.html'], function($, _, Backbone, app, SearchForm, template) {
  return Backbone.View.extend({
    el: $('body'),
    render: function() {
      this.$el.html(template);
      app.views.searchForm = new SearchForm();
      app.views.searchForm.render();
      return this.$el.find('#app-header').append(app.views.searchForm.el);
    }
  });
});

define('views/player/playerView', ['app', 'jquery', 'underscore', 'backbone', 'text!templates/player/player.html'], function(app, $, _, Backbone, html) {
  return Backbone.View.extend({
    el: $("#app-header div#player"),
    template: _.template(html),
    initialize: function() {
      this.$el.attr('class', 'flt-l');
      return _.bindAll(this, 'render');
    },
    render: function(data) {
      return $(this.el).html(this.template(data));
    },
    playFromURL: function(URL) {
      return $(this.el).find("audio#player source").attr('src', URL);
    }
  });
});

define('views/search/form', ['app', 'jquery', 'underscore', 'backbone', 'text!templates/search/form.html'], function(app, $, _, Backbone, tmpl) {
  var View;

  return View = Backbone.View.extend({
    template: _.template(tmpl),
    className: "flt-r",
    id: "search-box",
    events: {
      "click #go-search": "makeSearch"
    },
    initialize: function() {
      _.bindAll(this, 'fillUpForm');
      return app.on('list.load', this.fillUpForm);
    },
    render: function() {
      this.$el.append(this.template());
      return this;
    },
    fillUpForm: function(data) {
      this.$el.find('#search-artist').val(data.artist);
      return this.$el.find('#search-title').val(data.title);
    },
    makeSearch: function(e) {
      var artist, title;

      e.preventDefault();
      artist = this.$el.find('#search-artist').val();
      title = this.$el.find('#search-title').val();
      return app.trigger('list.load', {
        type: 'search',
        artist: app.methods.decodeStr(artist),
        title: app.methods.decodeStrtitle,
        $domElement: $("#search-mp3-list"),
        listTitle: 'Search similar tracks for "' + artist + ' - ' + title + '"'
      });
    }
  });
});

define('views/track/lastfmTrack', ['jquery', 'underscore', 'backbone', 'app', 'text!templates/track/lastfmTrack.html'], function($, _, Backbone, app, html) {
  return Backbone.View.extend({
    tagName: 'section',
    className: 'item',
    initialize: function() {
      this.template = html;
      return _.bindAll(this, 'selectMe', 'searchTrack', 'render');
    },
    events: {
      'click a': 'selectMe',
      'click header': 'reloadMe',
      'click .icon-search': 'searchTrack'
    },
    selectMe: function(e) {
      e.preventDefault();
      e.stopPropagation();
      app.log('lastfmTrack clicked: event', e);
      this.el = e.currentTarget;
      this.model.set('isActive', true);
      return app.trigger('list.load', {
        type: 'lastfm',
        artist: app.methods.decodeStr(this.model.get('artist').name),
        title: app.methods.decodeStr(this.model.get('name')),
        listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"',
        $domElement: $(e.currentTarget).closest('.track-line').next()
      });
    },
    reloadMe: function(e) {
      return e.stopPropagation();
    },
    searchTrack: function(e) {
      e.preventDefault();
      e.stopPropagation();
      app.log('lastfmTrack: searchTrack: model: ', this.model);
      return app.trigger('track.search', {
        type: 'search',
        artist: app.methods.decodeStr(this.model.get('artist').name),
        title: app.methods.decodeStr(this.model.get('name'))
      });
    },
    render: function() {
      var itemHTML;

      itemHTML = _.template(this.template, this.model.toJSON());
      return $(this.el).append(itemHTML);
    }
  });
});

define('views/track/searchTrack', ['jquery', 'underscore', 'backbone', 'app', 'text!templates/track/searchTrack.html'], function($, _, Backbone, app, html) {
  var View;

  return View = Backbone.View.extend({
    tagName: 'section',
    className: 'item clearfix',
    events: {
      'click .icon-play': 'playTrack',
      'click .icon-heart': 'likeMe'
    },
    initialize: function() {
      this.template = html;
      return _.bindAll(this, 'playTrack', 'likeMe', 'render', 'toggleActive');
    },
    playTrack: function(e) {
      e.preventDefault();
      e.stopPropagation();
      app.log('vkTrack: playTrack');
      app.trigger('track.play', {
        title: this.model.getTrackCreds(),
        url: this.model.get('url')
      });
      return app.trigger('track.setActive', {
        view: this
      });
    },
    toggleActive: function() {
      return this.$el.toggleClass('active');
    },
    likeMe: function() {
      var req, self;

      self = this;
      req = $.ajax(app.vk.baseurl + 'audio.add', {
        dataType: 'jsonp',
        data: {
          aid: self.model.get('aid'),
          oid: self.model.get('owner_id'),
          uid: app.vk.user_id,
          access_token: app.vk.access_token
        }
      });
      req.done(function() {
        return app.methods.messages.auto('blue', 'Audio added');
      });
      return req.fail(function() {
        return app.methods.messages.auto('red', 'Audio adding failed');
      });
    },
    render: function() {
      var itemHTML;

      itemHTML = _.template(this.template, this.model.toJSON());
      return $(this.el).append(itemHTML);
    }
  });
});

define('views/track/vkTrack', ['jquery', 'underscore', 'backbone', 'app', 'text!templates/track/vkTrack.html'], function($, _, Backbone, app, html) {
  var View;

  return View = Backbone.View.extend({
    tagName: 'section',
    className: 'item',
    initialize: function() {
      this.template = html;
      return _.bindAll(this, 'selectMe', 'playTrack', 'render', 'toggleActive');
    },
    events: {
      'click a': 'selectMe',
      'click .icon-play': 'playTrack'
    },
    selectMe: function(e) {
      e.preventDefault();
      e.stopPropagation();
      app.log('vkTrack clicked: event', e);
      return app.trigger('list.load', {
        type: 'lastfm',
        $domElement: $(e.currentTarget).parent().next(),
        artist: app.methods.decodeStr(this.model.get('artist')),
        title: app.methods.decodeStr(this.model.get('title')),
        listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"'
      });
    },
    playTrack: function(e) {
      e.preventDefault();
      e.stopPropagation();
      app.log('vkTrack: playTrack');
      app.trigger('track.play', {
        title: this.model.getTrackCreds(),
        url: this.model.get('url')
      });
      return app.trigger('track.setActive', {
        view: this
      });
    },
    toggleActive: function() {
      return this.$el.toggleClass('active');
    },
    render: function() {
      var itemHTML;

      itemHTML = _.template(this.template, this.model.toJSON());
      return $(this.el).append(itemHTML);
    }
  });
});

define('views/tracksList/lastfmTracksList', ['jquery', 'underscore', 'backbone', 'app', 'views/tracksList/prototype', 'views/track/lastfmTrack', 'text!templates/tracksList/lastfmTracksList.html'], function($, _, Backbone, app, tracksListViewPrototype, TrackView, html) {
  return tracksListViewPrototype.extend({
    template: _.template(html),
    initialize: function() {
      app.log('lastfmTrackList: init');
      return tracksListViewPrototype.prototype.initialize.apply(this, arguments);
    },
    events: {
      'click .icon-remove': 'closeMe'
    },
    render: function() {
      var docFrag;

      app.log('myTracksList: render: this', this);
      docFrag = document.createDocumentFragment();
      this.collection.each(function(TrackModel) {
        var view;

        if (TrackModel.get('artist') !== 'Unknown') {
          view = new TrackView({
            model: TrackModel
          });
          view.render();
          return docFrag.appendChild(view.el);
        }
      });
      this.$el.find('div')[0].appendChild(docFrag);
      return this;
    },
    closeMe: function(e) {
      var cid;

      e.preventDefault();
      e.stopPropagation();
      cid = this.$el.attr('id');
      this.$el.closest('.active').removeClass('active');
      return app.trigger('list.kill', cid);
    }
  });
});

define('views/tracksList/myTracksList', ['jquery', 'underscore', 'backbone', 'app', 'views/tracksList/prototype', 'views/track/vkTrack', 'text!templates/tracksList/myTracksList.html'], function($, _, Backbone, app, tracksListViewPrototype, TrackView, html) {
  return tracksListViewPrototype.extend({
    template: _.template(html),
    initialize: function() {
      app.log('myTrackList: init');
      return tracksListViewPrototype.prototype.initialize.apply(this, arguments);
    },
    render: function() {
      var docFrag;

      app.log('myTracksList: render: this', this);
      docFrag = document.createDocumentFragment();
      this.collection.each(function(TrackModel) {
        var view;

        if (TrackModel.get('artist') !== 'Unknown') {
          view = new TrackView({
            model: TrackModel
          });
          view.render();
          return docFrag.appendChild(view.el);
        }
      });
      this.$el.find('div')[0].appendChild(docFrag);
      return this;
    }
  });
});

define('views/tracksList/prototype', ['underscore', 'backbone'], function(_, Backbone) {
  return Backbone.View.extend({
    collection: void 0,
    className: 'tracks-list',
    initialize: function(params) {
      this.$el.attr('id', this.cid);
      this.$el.html(this.template({
        listTitle: params.data.listTitle
      }));
      return this;
    }
  });
});

define('views/tracksList/searchTracksList', ['jquery', 'underscore', 'backbone', 'app', 'views/tracksList/prototype', 'views/track/searchTrack', 'text!templates/tracksList/myTracksList.html'], function($, _, Backbone, app, tracksListViewPrototype, TrackView, html) {
  return tracksListViewPrototype.extend({
    template: _.template(html),
    initialize: function() {
      return tracksListViewPrototype.prototype.initialize.apply(this, arguments);
    },
    render: function() {
      var docFrag;

      docFrag = document.createDocumentFragment();
      this.collection.each(function(TrackModel) {
        var view;

        if (TrackModel.get('artist') !== 'Unknown') {
          view = new TrackView({
            model: TrackModel
          });
          view.render();
          return docFrag.appendChild(view.el);
        }
      });
      this.$el.find('div')[0].appendChild(docFrag);
      return this;
    }
  });
});
