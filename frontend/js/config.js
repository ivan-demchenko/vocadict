requirejs.config({

  baseUrl: './src/js',

  paths: {
    text: 'libs/require/text',
    jquery: 'libs/jquery/jquery-191',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    app: 'app'
  },

  deps: [
    "app",
    "views/tracksList/prototype",
    "views/tracksList/myTracksList",
    "views/tracksList/searchTracksList",
    "views/tracksList/lastfmTracksList"
    ],

  shim: {
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  }

});