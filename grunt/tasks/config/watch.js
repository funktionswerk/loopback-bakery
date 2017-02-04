module.exports = function (grunt) {

  var watchFiles = [
    'grunt/**/*.js',
    '**/*.json',
    'src/**/*.ts'
  ];

  var watchOptions = {
    interrupt: true,
    debounceDelay: 250
  };

  grunt.config.set('watch', {
    'test': {
      options: watchOptions,
      files: watchFiles,
      tasks: [ 'test' ]
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-watch' );
};
