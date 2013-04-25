  requirejs.config
    baseUrl: './'
    paths:
      text: 'libs/text'
      jquery: 'libs/jquery'
      underscore: 'libs/underscore'
      backbone: 'libs/backbone'
      soundmanager: 'libs/soundmanager'

    deps: [
      "app",
      "text!templates/track/lastfmTrack.html",
      "text!templates/track/searchTrack.html",
      "text!templates/track/vkTrack.html",
      "text!templates/tracksList/lastfmTracksList.html",
      "text!templates/tracksList/myTracksList.html"
    ]

    shim:
      soundmanager:
        exports: "soundmanager"

      underscore:
        exports: "_"

      backbone:
        deps: ["underscore", "jquery"]
        exports: "Backbone"