module.exports = function(grunt) {

  grunt.config(
    'mochaTest', {
      test: {
        options: {
          reporter: 'spec',
          quiet: false,
          log: true
        },
        src: [
          'src/**/*.spec.js'
        ]
      }
    }
  );

  grunt.loadNpmTasks('grunt-mocha-test');
};