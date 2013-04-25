define 'models/search',
['app', 'jquery', 'underscore', 'backbone'],
(app, $, _, Backbone, html) ->
  Backbone.Model.extend
    defaults:
      entryContent: ''