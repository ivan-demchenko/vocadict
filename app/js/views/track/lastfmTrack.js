/**
 * VK TRACK ITEM VIEW
**/

define([
// Libs
'jquery',
'underscore',
'backbone',

// Deps
'app',
'views/track/prototype',

// Template
'text!templates/track/lastfmTrack.html'
],
function($, _, Backbone, app, trackViewPrototype, html){

    var View = trackViewPrototype.extend({
        initialize: function() {
            this.template = html;
            trackViewPrototype.prototype.initialize.apply(this,arguments);
        },
        /**
         * Cliked on track's tag.
         **/
        selectMe: function selectMe(e) {
            app.log('lastfmTrack clicked');

            e.preventDefault();
            e.stopPropagation();

            trackViewPrototype.prototype.selectMe.apply(this,arguments);
            app.trigger('list.load', {
                deleteable: true,
                $domElement: $(e.currentTarget).find('.sub-track'),
                artist: app.methods.decodeStr(this.model.get('artist').name),
                title: app.methods.decodeStr(this.model.get('name')),
                listTitle: 'Similar tracks to "' + this.model.getTrackCreds() + '"'
            });
        },
        /**
         * Button Play clicked.
         **/
        playTrack: function playTrack(e) {
            app.log('lastfmTrack: playTrack: model: ', this.model);

            e.preventDefault();
            e.stopPropagation();

            app.trigger('track.search', {
                type: 'vk',
                deleteable: false,
                method: 'audio.search',
                listTitle: 'Variant of "' + this.model.getTrackCreds() + '"',
                $domElement: $("#search-mp3-list"),
                artist: app.methods.decodeStr(this.model.get('artist').name),
                title: app.methods.decodeStr(this.model.get('name'))
            });
        }
    });

    return View;
});