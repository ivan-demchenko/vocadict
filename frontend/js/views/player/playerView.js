define([
// Deps
'app',
'jquery',
'underscore',
'backbone',
// Templates
'text!templates/player/player.html'

], function(app, $, _, Backbone, html){

    var View = Backbone.View.extend({

        el: $("#app-header div#player"),

        template: _.template(html),

        initialize: function(){
            this.$el.attr('class', 'flt-l');
            _.bindAll(this, 'render');
        },

        render: function(data) {
            $(this.el).html(this.template(data));
        },

        playFromURL: function playFromURL(URL) {
            $(this.el).find("audio#player source").attr('src', URL);
        }

    });

    return View;

});