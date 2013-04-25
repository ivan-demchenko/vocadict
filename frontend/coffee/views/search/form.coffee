define 'views/search/form',
['app', 'jquery', 'underscore', 'backbone','text!templates/search/form.html' ],
(app, $, _, Backbone, tmpl) ->
  View = Backbone.View.extend
    template: _.template tmpl
    className: "flt-r"
    id: "search-box"

    events:
      "click #go-search": "makeSearch"

    initialize: ->
      _.bindAll this, 'fillUpForm'
      app.on 'list.load', this.fillUpForm

    render: ->
      this.$el.append this.template()
      return this

    fillUpForm: (data) ->
      this.$el.find('#search-artist').val data.artist
      this.$el.find('#search-title').val data.title

    makeSearch: (e) ->
      e.preventDefault();

      artist = this.$el.find('#search-artist').val()
      title = this.$el.find('#search-title').val()

      app.trigger 'list.load',
        type: 'search'
        artist: app.methods.decodeStr artist
        title: app.methods.decodeStrtitle
        $domElement: $ "#search-mp3-list"
        listTitle: 'Search similar tracks for "' + artist + ' - ' + title + '"'
