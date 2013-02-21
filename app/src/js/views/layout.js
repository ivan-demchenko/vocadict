define([
  // Libs
  'jquery',
  'underscore',
  'backbone',

  // Deps
  'app',

  // Child view
  'views/search/form',

  // Templates
  'text!templates/layout.html'
],
  function ($, _, Backbone, app, SearchForm, template) {

    var View = Backbone.View.extend({

      el: $('body'),

      render: function () {
        this.$el.html(template);
        app.views.searchForm = new SearchForm();
        app.views.searchForm.render();
        this.$el.find('#app-header').append(app.views.searchForm.el);
      }

    });

    return View;
  });