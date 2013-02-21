define([
// Deps
'app',
'jquery',
'underscore',
'backbone',

// Template
'text!templates/search/form.html'
],
function(app, $, _, Backbone, tmpl){

    var View = Backbone.View.extend({

        template: _.template(tmpl),
        className: "flt-r",
        id: "search-box",

        events: {
            "click #go-search": "makeSearch"
        },

        initialize: function() {
            _.bindAll(this, 'fillUpForm');
            app.on('list.load', this.fillUpForm);
        },

        render: function() {
            this.$el.append(this.template());
            return this;
        },

        fillUpForm: function(data) {
            this.$el.find('#search-artist').val(data.artist);
            this.$el.find('#search-title').val(data.title);
        },

        makeSearch: function(e) {
            e.preventDefault();

            var artist = this.$el.find('#search-artist').val();
            var title = this.$el.find('#search-title').val();

            app.trigger('list.load', {
                type: 'lastfm',
                artist: app.methods.decodeStr(artist),
                title: app.methods.decodeStr(title), 
                listTitle: 'Track similar to ' + artist + ' - ' + title
            });
        }

    });

    return View;
});