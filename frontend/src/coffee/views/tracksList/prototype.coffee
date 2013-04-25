define 'views/tracksList/prototype',
['underscore','backbone'],
(_, Backbone) ->
  Backbone.View.extend
    collection: undefined
    className: 'tracks-list'

    initialize: (params) ->
      this.$el.attr 'id', this.cid
      this.$el.html this.template listTitle: params.data.listTitle
      return @;