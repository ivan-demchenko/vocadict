module.exports = function (grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    cssmin: {
      compress: {
        files: {
          "build/app.min.css": ["css/full.css", "css/app.css", "css/theme.css"]
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          name: 'main',
          optimize: "uglify",
          baseUrl: "js/",
          mainConfigFile: "js/config.js",
          out: "build/app.js"
        }
      }
    },

    uglify: {
      build: {
        files: {
          'build/app.min.js': ['build/app.js']
        }
      }
    },

    jshint: {
      build: {
        all: ['Gruntfile.js', 'build/app.min.js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['cssmin', 'requirejs', 'uglify', 'jshint']);

};