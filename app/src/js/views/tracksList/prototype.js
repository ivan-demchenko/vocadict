/** TRACKS LIST PROTOTYPE
 *  It suppose that it will do some general thigs
 **/
define([
  // Libs
  'underscore',
  'backbone'
],
  function (_, Backbone) {

    var View = Backbone.View.extend({

      collection: undefined,

      className: 'tracks-list',

      initialize: function initialize(params) {
        this.$el.attr('id', this.cid);
        this.$el.html(this.template({ listTitle: params.data.listTitle }));
        return this;
      }

    });

    return View;
  });