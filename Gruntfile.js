'use strict';

var fs = require('fs');

var webBanner = fs.readFileSync('./lib/web.prefix.js').toString();

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');

  // I don't like using Grunt for small packages, but we want to interpolate
  // the version string.
  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    concat: {
      options: {
        banner: webBanner
      },
      web: {
        src: [
          'lib/index.js',
          'lib/web.suffix.js'
        ],
        dest: 'dist/piggyback-buffer.js'
      }
    }
  });

  grunt.registerTask('default', ['concat']);
};
