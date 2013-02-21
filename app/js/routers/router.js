/**
 * MAIN ROUTER
**/

define([
'app',
'underscore',
'backbone'
],
function(app, _, Backbone){

    var Router = Backbone.Router.extend({

        routes: {
            '': 'index'
        },

        index: function()
        {
            if( app.vk.access_token === null && app.vk.user_id === null ) {
                require(['models/vkUser'], function(vkUserModel){
                    app.models.vk_user = new vkUserModel();
                });
            } else {
                require(['views/search/form'], function( SearchFormView){
                    app.views.searchView = new SearchFormView();
                    app.views.searchView.render();
                });
            }
        }

    });

    return Router;
});