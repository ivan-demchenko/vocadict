define 'collections/vkSongs',
['app', 'jquery', 'underscore', 'backbone', 'models/vkSong'],
(app, $, _, BB, vkSongModel) ->
  BB.Collection.extend
    method: 'audio.get'
    model: vkSongModel

    url: ->
      app.vk.baseurl + @method

    initialze: (data) ->
      @method = data.method

    parse: (res) ->
      data = res.response