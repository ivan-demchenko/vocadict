module.exports = function (grunt) {
  "use strict";
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jade');
  // Project configuration.
  grunt.initConfig({

    watch: {
      templates: {
        files: ['jade/**/*.jade'],
        tasks: ['jade']
      },
      style: {
        files: ['stylus/**/*.styl'],
        tasks: ['stylus:dev']
      },
      scripts: {
        files: ['coffee/**/*.coffee'],
        tasks: ['coffee', 'requirejs:dev']
      }
    },

    stylus: {
      dev: {
        options: {
          compress: false
        },
        files: {
          '../app/dev/app.css': ['stylus/app.styl']
        }
      },
      prod: {
        files: {
          'temp/app.css': ['stylus/app.styl']
        }
      }
    },

    cssmin: {
      prod: {
        files: {
          "../app/app.css": ["temp/app.css"]
        }
      }
    },

    jade: {
      compile: {
        options: {
          comileDebug: true,
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: 'jade',
            src: ['**/*.jade'],
            dest: 'staging/templates',
            ext: '.html'
          }
        ]
      }
    },

    coffee: {
      compile: {
        options: {
          bare: true
        },
        files: [
          {
            dest: 'staging/config.js',
            src: 'coffee/config.coffee'
          },
          {
            dest: 'staging/app.js',
            src: ['coffee/**/*.coffee', '!coffee/config.coffee']
          }
        ]
      }
    },

    requirejs: {
      options: {
        inlineText: true,
        findNestedDependencies: true,
        name: 'app',
        baseUrl: "./staging",
        mainConfigFile: "staging/config.js",
      },
      dev: {
        options: {
          optimize: "none",
          out: "../app/dev/app.js"
        }
      },
      prod: {
        options: {
          optimize: "uglify",
          out: "temp/app.js"
        }
      }
    },

    uglify: {
      prod: {
        files: {
          '../app/app.js': ['temp/app.js']
        }
      }
    },

    clean: {
      dev: ["temp"],
      prod: ["temp", "staging"]
    }
  });

  grunt.registerTask('build-dev', ['stylus:dev', 'requirejs:dev', 'clean:dev']);
  grunt.registerTask('build-prod', ['stylus:prod', 'cssmin', 'coffee', 'requirejs:prod', 'uglify', 'clean:prod']);
};