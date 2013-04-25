requirejs.config({
  baseUrl: './',
  paths: {
    text: 'libs/require/text',
    jquery: 'libs/jquery/jquery-191',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone'
  },
  deps: ["app", "text!templates/track/lastfmTrack.html", "text!templates/track/searchTrack.html", "text!templates/track/vkTrack.html", "text!templates/tracksList/lastfmTracksList.html", "text!templates/tracksList/myTracksList.html"],
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
