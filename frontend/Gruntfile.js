module.exports = function (grunt) {
  "use strict";
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  // Project configuration.
  grunt.initConfig({
    watch: {
      style: {
        files: ['css/app.styl'],
        tasks: ['stylus', 'cssmin']
      }
    },
    stylus: {
      compile: {
        options: {
          paths: ['css']
        },
        files: {
          'temp/app.css': ['css/app.styl']
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          "../app/app.min.css": ["temp/app.css"]
        }
      }
    },
    requirejs: {
      compile: {
        options: {
          findNestedDependencies: true,
          name: 'app',
          baseUrl: "js",
          mainConfigFile: "js/config.js",
          out: "temp/app.js"
        }
      }
    },
    uglify: {
      build: {
        files: {
          '../app/app.min.js': ['temp/app.js']
        }
      }
    },
    clean: ["temp"]
  });
  grunt.registerTask('default', ['stylus', 'cssmin', 'requirejs', 'uglify', 'clean']);
};