define 'views/tracksList/lastfmTracksList', [
  'jquery','underscore','backbone','app',
  'views/track/lastfmTrack',
  'text!templates/tracksList/lastfmTracksList.html'
],
($, _, Backbone, app, TrackView, html) ->
  Backbone.View.extend

    template: _.template html
    className: 'tracks-list'

    initialize: (params) ->
      app.log 'lastfmTrackList: init'
      @$el.html @template listTitle: params.data.listTitle
      @render()

    events:
      'click .icon-remove': 'closeMe'

    render: ->
      app.log 'myTracksList: render: this', this

      docFrag = document.createDocumentFragment()
      @collection.each (TrackModel) ->
        if TrackModel.get('artist') isnt 'Unknown'
          view = new TrackView model: TrackModel
          view.render()
          docFrag.appendChild view.el
      @$el.find('div')[0].appendChild docFrag
      @$el.attr 'id', @cid
      @

    closeMe: (e) ->
      e.preventDefault()
      e.stopPropagation()

      cid = @$el.attr 'id'
      @$el.closest('.active').removeClass 'active'
      app.trigger 'list.kill', cid