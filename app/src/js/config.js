require.config({

  baseUrl: '/src/js',

  paths: {
    text: 'libs/require/text',
    jquery: 'libs/jquery/jquery-1.9.1',
    underscore: 'libs/lodash/lodash',
    backbone: 'libs/backbone/backbone-optamd3-min',
    app: 'app'
  },

  deps: ['main'],

  shim: {
    underscore: {
      exports: "_"
    },

    backbone: {
      deps: ["underscore", "jquery"],
      exports: "backbone"
    }
  }

});