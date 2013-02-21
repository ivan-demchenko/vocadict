/**
 * VK USER MODEL
**/

define([
  // Libs
  'jquery',
  'underscore',
  'backbone',
  // Deps
  'app'
],
  function ($, _, BB, app) {

    var Model = BB.Model.extend({
      initialize: function () {
        var url = 'http://oauth.vk.com/authorize?'
          + 'client_id=' + app.vk.app_id
          + '&scope=audio,offline'
          + '&redirect_uri=' + app.rootURL + '/vkauth'
          + '&display=page'
          + '&response_type=token';
        window.open(url, 'VKAUTH', 'width=500,height=600');
      }
    });
    return Model;
});