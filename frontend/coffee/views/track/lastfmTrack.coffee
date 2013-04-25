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
      'click .icon-search': 'searchTrack'

    selectMe: (e) ->
      e.preventDefault();
      e.stopPropagation();

      app.log 'lastfmTrack clicked: event', e

      this.el = e.currentTarget;
      this.model.set 'isActive', true

      app.trigger 'list.load',
        type: 'lastfm'
        artist: app.methods.decodeStr(this.model.get('artist').name)
        title: app.methods.decodeStr(this.model.get('name'))
        listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"'
        $domElement: $(e.currentTarget).closest('.track-line').next()

    reloadMe: (e) ->
      e.stopPropagation();

    searchTrack: (e) ->
      e.preventDefault();
      e.stopPropagation();

      app.log 'lastfmTrack: searchTrack: model: ', this.model

      app.trigger 'track.search',
        type: 'search'
        artist: app.methods.decodeStr(this.model.get('artist').name)
        title: app.methods.decodeStr(this.model.get('name'))

    render: ->
      itemHTML = _.template this.template, this.model.toJSON()
      $(this.el).append itemHTML