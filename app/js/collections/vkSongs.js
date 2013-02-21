/**
 * VK SONGS COLLECTION
**/

define([
// Deps
'app',
'jquery',
'underscore',
'backbone',

'models/vkSong'
],
function(app, $, _, BB, vkSongModel){

    var Collection = BB.Collection.extend({

        method: 'audio.get',

        url: function() {
            return app.vk.baseurl + this.method;
        },

        initialze: function(data) {
            this.method = data.method;
        },

        model: vkSongModel,

        parse: function(res) {
            var data = res.response;
            return data;
        }

    });

    return Collection;
});