define 'app', ['jquery','underscore','backbone','appLogic'],
($, _, Backbone, appLogic) ->
  $(document).on "click", "a[href]:not([data-bypass])", (evt) ->
    href = prop: $(this).prop("href"), attr: $(this).attr("href")
    root = location.protocol + "//" + location.host + appLogic.root;
    if href.prop.slice(0, root.length) == root
      evt.preventDefault();
      Backbone.history.navigate href.attr, trigger: true

  $.ajaxSetup
    beforeSend: ->
      app.methods.messages.show 'blue', 'Just a few seconds, loading...'
    complete: ->
      app.methods.messages.hide()

  # Bootstrap App with Events and Routings
  app = _.extend appLogic, Backbone.Events

  router = Backbone.Router.extend
    routes:
      '': "index"
      'landing': 'landing'
      'joinvk': 'joinvk'

    index: ->
      appLogic.log 'app: router: index'
      appLogic.start()

    landing: ->
      require ['views/landing'], (LandingLayout) ->
        new LandingLayout el: document.getElementById 'app'

    joinvk: ->
      url = 'http://oauth.vk.com/authorize?' +
            'client_id=' + appLogic.vk.app_id +
            '&scope=audio,offline' +
            '&redirect_uri=' + appLogic.rootURL + '/vkauth' +
            '&display=page' +
            '&response_type=token';
      window.location.href = url;

  _.extend app, new router

  Backbone.history.start pushState: true

  return app