/**
 * VK SONG MODEL
**/

define([
// Deps
'backbone'
],
function(Backbone){
    var Model = Backbone.Model.extend({
        defaults: {
            "artist": "Unknown",
            "title": "Untitled",
            "url": "none",
            "isActive": false
        },
        getSimilarUrl: function() {
            return 'similar/' + this.get('artist') + '/' + this.get('title');
        },
        getTrackCreds: function() {
            return this.get('artist') + ' - ' + this.get('title');
        }
    });
    return Model;
});