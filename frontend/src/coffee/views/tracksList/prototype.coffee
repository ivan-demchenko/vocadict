define 'views/tracksList/prototype',
['underscore','backbone'],
(_, Backbone) ->
  Backbone.View.extend
    collection: undefined
    className: 'tracks-list'

    initialize: (params) ->

      @