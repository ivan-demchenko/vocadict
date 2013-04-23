require.config({

  baseUrl: '/src/js',

  paths: {
    text: 'libs/require/text',
    jquery: 'libs/jquery/jquery-190-min',
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-min',
    app: 'app'
  },

  deps: ['main'],

  shim: {
    main: {
      deps: ['app']
    },

    underscore: {
      exports: "_"
    },

    backbone: {
      deps: ["underscore", "jquery"],
      exports: "backbone"
    }
  }

});