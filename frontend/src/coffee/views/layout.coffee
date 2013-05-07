define 'views/layout',
['jquery','underscore','backbone','app','views/search/form','text!templates/layout.html'],
($, _, Backbone, app, SearchForm, template) ->
  Backbone.View.extend
    initialize: ->
      app.log 'views/layout: init'

      @render()
    render: ->
      app.log 'views/layout: render'

      this.$el.html template
      app.views.searchForm = new SearchForm();
      app.views.searchForm.render();
      this.$el.find('#app-header').append app.views.searchForm.el
