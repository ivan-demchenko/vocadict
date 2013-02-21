module.exports = function (grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    lint: {
      dist: {
        files: ['js/app.js']
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'js/**/*.js']
    },

    concat: {
      dist: {
        src: [
          'js/app.pretty.js'
        ],
        dest: 'build/js/production.js'
      }
    },

    min: {
      dist : {
        src : 'build/js/production.js',
        dest : 'build/js/production.min.js'
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.registerTask('default', ['jshint']);

};