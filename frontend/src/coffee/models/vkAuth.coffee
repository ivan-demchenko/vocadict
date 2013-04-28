define  'models/vkAuth',
['jquery', 'underscore', 'backbone','app'],
($, _, BB, app) ->
  BB.Model.extend
    initialize: ->
      url = 'http://oauth.vk.com/authorize?' +
            'client_id=' + app.vk.app_id +
            '&scope=audio,offline' +
            '&redirect_uri=' + app.rootURL + '/vkauth' +
            '&display=page' +
            '&response_type=token';
      window.location.href = url;