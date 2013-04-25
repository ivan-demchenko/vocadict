define 'collections/lastfmSongs',
['app','jquery','underscore','backbone','models/lastfmSong'],
(app, $, _, BB, lastfmSongModel) ->
  BB.Collection.extend
    url: app.lastfm.url
    model: lastfmSongModel
    parse: (res) ->
      if res.error
        app.methods.messages.auto 'red', res.message
      else
        res.similartracks.track;