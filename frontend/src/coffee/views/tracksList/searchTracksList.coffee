define 'views/tracksList/searchTracksList', [
  'jquery','underscore','backbone','app',
  'views/track/searchTrack',
  'text!templates/tracksList/myTracksList.html'
],
($, _, Backbone, app, TrackView, html) ->
  Backbone.View.extend

    template: _.template html
    className: 'tracks-list'

    initialize: (params) ->
      @$el.html @template listTitle: params.data.listTitle
      @render()

    render: ->
      docFrag = document.createDocumentFragment();

      @collection.each (TrackModel) ->
        if TrackModel.get('artist') isnt 'Unknown'
          view = new TrackView model: TrackModel
          view.render()
          docFrag.appendChild view.el

      @$el.find('div')[0].appendChild docFrag

      @