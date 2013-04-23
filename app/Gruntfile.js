module.exports = function (grunt) {
  "use strict";
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Project configuration.
  grunt.initConfig({
    stylus: {
      compile: {
        options: {
          paths: ['src/css/src']
        },
        files: {
          'temp/app.css': ['src/css/src/*.styl']
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          "app.min.css": ["src/css/full.css", "temp/app.css"]
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          name: 'main',
          baseUrl: "src/js/",
          include: ['main'],
          optimize: "uglify",
          mainConfigFile: "src/js/config.js",
          insertRequire: ['main'],
          out: "temp/app.js",
          inlineText: true,
          wrap: true,
          findNestedDependencies: true
        }
      }
    },
    uglify: {
      build: {
        files: {
          'app.min.js': ['temp/app.js']
        }
      }
    },
    clean: ["temp"]
  });
  grunt.registerTask('default', ['stylus', 'cssmin', 'requirejs', 'uglify', 'clean']);
};