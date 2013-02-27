/** PROTOTYPE OF TRACK VIEW **/
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
        _.bindAll(this, 'setMeActive', 'selectMe', 'render', 'playTrack');
        this.model.on('change:isActive', this.setMeActive);
      },
      events: {
        'click': 'selectMe',
        'click .icon-play': 'playTrack',
        'click .icon-search': 'playTrack'
      },
      selectMe: function selectMe(e) {
        app.log('track clicked');

        this.el = e.currentTarget;
        this.model.set('isActive', true);
      },
      render: function render() {
        var itemHTML = _.template(this.template, this.model.toJSON());
        $(this.el).append(itemHTML);
      },
      setMeActive: function setMeActive() {
        //$(this.el).toggleClass('active', this.model.get('isActive'));
      }
    });

    return View;
  });