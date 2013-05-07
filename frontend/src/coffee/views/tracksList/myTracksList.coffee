define 'views/tracksList/myTracksList', [
  'jquery', 'underscore','backbone', 'app',
  'views/track/vkTrack',
  'text!templates/tracksList/myTracksList.html'
],
($, _, Backbone, app, TrackView, html) ->
  Backbone.View.extend

    template: _.template html
    className: 'tracks-list'

    initialize: (params) ->
      app.log 'myTrackList: init'
      @$el.html @template listTitle: params.data.listTitle
      @render()

    render: ->
      app.log 'myTracksList: render: this', this

      docFrag = document.createDocumentFragment();
      @collection.each (TrackModel) ->
        if TrackModel.get('artist') isnt 'Unknown'
          view = new TrackView model: TrackModel
          view.render()
          docFrag.appendChild view.el

      @$el.find('div')[0].appendChild docFrag

      @