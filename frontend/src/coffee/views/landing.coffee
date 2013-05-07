define 'views/landing',
['jquery','underscore','backbone','app','text!templates/landing.html' ],
($, _, Backbone, app, html) ->
  View = Backbone.View.extend

    tagName: 'section'
    id: 'bigbanner'
    template: _.template html

    initialize: ->
      app.log 'views/landing: init'

      @render()

    render: ->
      app.log 'views/landing: render'

      @$el.html @template