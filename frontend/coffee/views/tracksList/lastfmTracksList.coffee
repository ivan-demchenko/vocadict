define 'views/tracksList/lastfmTracksList',
['jquery','underscore','backbone','app',
  'views/tracksList/prototype',
  'views/track/lastfmTrack',
  'text!templates/tracksList/lastfmTracksList.html'
],
($, _, Backbone, app, tracksListViewPrototype, TrackView, html) ->
  tracksListViewPrototype.extend
    template: _.template html
    initialize: ->
      app.log 'lastfmTrackList: init'
      tracksListViewPrototype.prototype.initialize.apply this, arguments

    events:
      'click .icon-remove': 'closeMe'

    render: ->
      app.log 'myTracksList: render: this', this

      docFrag = document.createDocumentFragment();

      this.collection.each (TrackModel) ->
        if TrackModel.get('artist') isnt 'Unknown'
          view = new TrackView model: TrackModel
          view.render();
          docFrag.appendChild view.el

      this.$el.find('div')[0].appendChild docFrag

      return @

    closeMe: (e) ->
      e.preventDefault()
      e.stopPropagation()

      cid = this.$el.attr 'id'
      this.$el.closest('.active').removeClass 'active'
      app.trigger 'list.kill', cid