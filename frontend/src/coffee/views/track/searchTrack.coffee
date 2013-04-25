define 'views/track/searchTrack',
['jquery','underscore','backbone','app','text!templates/track/searchTrack.html' ],
($, _, Backbone, app, html) ->
  View = Backbone.View.extend
    tagName: 'section'
    className: 'item clearfix'
    events:
      'click .icon-play': 'playTrack'
      'click .icon-heart': 'likeMe'

    initialize:  ->
      this.template = html
      _.bindAll this, 'playTrack', 'likeMe', 'render', 'toggleActive'

    playTrack: (e) ->
      e.preventDefault()
      e.stopPropagation()

      app.log 'vkTrack: playTrack'

      app.trigger 'track.play',
        title: this.model.getTrackCreds()
        url: this.model.get('url')

      app.trigger 'track.setActive', view: this

    toggleActive: ->
      this.$el.toggleClass 'active'

    likeMe: ->
      self = this;
      req = $.ajax app.vk.baseurl + 'audio.add',
        dataType: 'jsonp'
        data:
          aid: self.model.get 'aid'
          oid: self.model.get 'owner_id'
          uid: app.vk.user_id
          access_token: app.vk.access_token

      req.done ->
        app.methods.messages.auto 'blue', 'Audio added'
      req.fail ->
        app.methods.messages.auto 'red', 'Audio adding failed'

    render: ->
      itemHTML = _.template this.template, this.model.toJSON()
      $(this.el).append itemHTML
