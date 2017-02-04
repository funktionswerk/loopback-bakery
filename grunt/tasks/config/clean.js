module.exports = function(grunt) {

  grunt.config(
    'clean',
    {
      src: [
        'src/**/*.js'
      ]
    }
  );

  grunt.loadNpmTasks('grunt-contrib-clean');
};