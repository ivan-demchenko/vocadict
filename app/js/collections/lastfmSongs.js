/**
 * VK SONGS COLLECTION
**/

define([
// Deps
'app',
'jquery',
'underscore',
'backbone',

'models/lastfmSong'
],
function(app, $, _, BB, lastfmSongModel){

    var Model = BB.Collection.extend({

        url: app.lastfm.url,

        model: lastfmSongModel,

        parse: function(res) {
            if( res.error ) {
                app.methods.messages.auto('red', res.message);
                return;
            } else {
                return res.similartracks.track;
            }
        }

    });

    return Model;
});