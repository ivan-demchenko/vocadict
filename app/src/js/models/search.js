define([
  // Deps
  'app',
  'jquery',
  'underscore',
  'backbone'
],
  function (app, $, _, Backbone, html) {

    var Model = Backbone.Model.extend({
      defaults: {
        entryContent: ''
      }
    });

    return Model;
  });