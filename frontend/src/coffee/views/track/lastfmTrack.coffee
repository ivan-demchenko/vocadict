define 'views/track/lastfmTrack',
['jquery','underscore','backbone','app','text!templates/track/lastfmTrack.html'],
($, _, Backbone, app, html) ->
  Backbone.View.extend
    tagName: 'section'
    className: 'item'

    initialize: ->
      @template = html;
      _.bindAll this, 'selectMe', 'searchTrack', 'render'

    events:
      'click a': 'selectMe'
      'click header': 'reloadMe'
      'click button.search': 'searchTrack'

    selectMe: (e) ->
      e.preventDefault();
      e.stopPropagation();

      app.log 'lastfmTrack clicked: event', e

      @el = e.currentTarget;
      @model.set 'isActive', true

      app.trigger 'list.load',
        type: 'lastfm'
        artist: app.methods.decodeStr(@model.get('artist').name)
        title: app.methods.decodeStr(@model.get('name'))
        listTitle: 'Similar tracks to "' + @model.getTrackCreds() + '"'
        $domElement: $(e.currentTarget).closest('.track-line').next()

    reloadMe: (e) ->
      e.stopPropagation();

    searchTrack: (e) ->
      e.preventDefault();
      e.stopPropagation();

      app.log 'lastfmTrack: searchTrack: model: ', @model

      app.trigger 'track.search',
        type: 'search'
        artist: app.methods.decodeStr(@model.get('artist').name)
        title: app.methods.decodeStr(@model.get('name'))

    render: ->
      itemHTML = _.template @template, @model.toJSON()
      $(@el).append itemHTML