(function(){
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
// load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      css: { // watch all .sass files and call the sass task to convert them to .stylesheets
        files: 'stylesheets/sass/*.sass',
        tasks: ['sass', 'minifyCss']
      },
      scripts: {
        files: ['js/*.js', 'test/*Spec.js'],
        tasks: ['test', 'jshint', 'minifyJs']
      },
      livereload: {
        files: [
          'index.html',
          'stylesheets/css/*.css', // reload converted .css file
          'js/*.js'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.')
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>'
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'stylesheets/css/style.css': 'stylesheets/sass/style.sass',
          'stylesheets/css/reset.css': 'stylesheets/sass/reset.sass',
          'stylesheets/bootstrap-sass-official/bootstrap.css': 'bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap.scss'
        }
      }
    },
    jasmine: {
      pivotal: {
        src: 'js/**/*.js',
        options: {
          specs: 'test/*Spec.js',
          helpers: 'test/*Helper.js'
        }
      }
    },
    jshint: {
      all: ['js/*.js', 'test/*.js']
    },
    concat: {
      options: {
        separator: ";"
      },
      dist: {
        src: [
          'js/**/*.js',
        ],
        dest: 'js/concat.js'
      }
    },
    uglify: {
      options: {
        compress: {
          drop_console: true //removes all console.log, console.table ...
        }
      },
      my_target: {
        files: {
          'js/minify/minify.min.js': ['js/concat.js']
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'stylesheets/css/minify/minify.css': ['stylesheets/css/style.css', 'stylesheets/css/reset.css']
        }
      }
    }
  });

  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('build', ['concat', 'uglify', 'cssmin']);
  grunt.registerTask('server', ['sass', 'connect:livereload', 'open', 'watch']);
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('con', ['concat']);
  grunt.registerTask('minifyJs', ['uglify']);
  grunt.registerTask('minifyCss', ['cssmin']);
};
})();