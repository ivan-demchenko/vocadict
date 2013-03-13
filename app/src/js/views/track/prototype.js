/**
 * PROTOTYPE OF TRACK VIEW
**/

define([
  // Deps
  'app',
  'jquery',
  'underscore',
  'backbone'
],
  function (app, $, _, Backbone) {

    var View = Backbone.View.extend({
      tagName: 'section',

      className: 'item',

      initialize: function (params) {
        _.bindAll(this, 'selectMe', 'render');
      },

      render: function render() {
        var itemHTML = _.template(this.template, this.model.toJSON());
        $(this.el).append(itemHTML);
      }

    });

    return View;
  });