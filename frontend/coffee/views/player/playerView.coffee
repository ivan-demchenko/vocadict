define 'views/player/playerView',
['app','jquery','underscore','backbone','text!templates/player/player.html'],
  (app, $, _, Backbone, html) ->

    Backbone.View.extend
      el: $ "#app-header div#player"
      template: _.template html

      initialize: ->
          this.$el.attr 'class', 'flt-l'
          _.bindAll this, 'render'

      render: (data) ->
          $(this.el).html this.template data

      playFromURL: (URL) ->
          $(this.el).find("audio#player source").attr('src', URL);