require.config({

    baseUrl: '/js/',

    paths: {
        text: 'libs/require/text',
        jquery: 'libs/jquery/jquery-190-min',
        underscore: 'libs/underscore/underscore-min',
        backbone: 'libs/backbone/backbone-min',
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