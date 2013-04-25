define 'views/track/vkTrack',
['jquery','underscore','backbone','app','text!templates/track/vkTrack.html'],
($, _, Backbone, app, html) ->
  View = Backbone.View.extend
    tagName: 'section'
    className: 'item'

    initialize: ->
      this.template = html;
      _.bindAll this, 'selectMe', 'playTrack', 'render', 'toggleActive'

    events:
      'click a': 'selectMe'
      'click .icon-play': 'playTrack'

    selectMe: (e)->
      e.preventDefault()
      e.stopPropagation()

      app.log 'vkTrack clicked: event', e

      app.trigger 'list.load',
        type: 'lastfm'
        $domElement: $(e.currentTarget).parent().next()
        artist: app.methods.decodeStr this.model.get 'artist'
        title: app.methods.decodeStr this.model.get 'title'
        listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"'

    playTrack: (e)->
      e.preventDefault()
      e.stopPropagation()

      app.log 'vkTrack: playTrack'

      app.trigger 'track.play',
        title: this.model.getTrackCreds()
        url: this.model.get('url')

      app.trigger 'track.setActive', view: this

    toggleActive: ->
      this.$el.toggleClass 'active'

    render: ->
      itemHTML = _.template this.template, this.model.toJSON()
      $(this.el).append itemHTML
