module.exports = function (grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    stylus: {
      compile: {
        options: {
          paths: ['src/css/src']
        },
        files: {
          'app.css': ['src/css/src/*.styl'] // compile and concat into single file
        }
      }
    },

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
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['stylus', 'cssmin', 'requirejs', 'uglify', 'jshint']);

};