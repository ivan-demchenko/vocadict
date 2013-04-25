define 'views/tracksList/searchTracksList',
['jquery','underscore','backbone','app',
  'views/tracksList/prototype',
  'views/track/searchTrack',
  'text!templates/tracksList/myTracksList.html'
],
($, _, Backbone, app, tracksListViewPrototype, TrackView, html) ->
  tracksListViewPrototype.extend

    template: _.template html

    initialize: ->
      tracksListViewPrototype.prototype.initialize.apply this, arguments

    render: ->
      docFrag = document.createDocumentFragment();

      this.collection.each (TrackModel) ->
        if TrackModel.get('artist') isnt 'Unknown'
          view = new TrackView model: TrackModel
          view.render();
          docFrag.appendChild view.el

      this.$el.find('div')[0].appendChild docFrag

      return @