module.exports = function (grunt) {
  var src = [
    'src/**/*.ts'
  ];

  grunt.config.set('ts', {
    'dev': {
      src: src,
      options: {
        module: 'commonjs',
        fast: 'never',
        sourceMap: true
      }
    },
    'prod': {
      src: src,
      options: {
        module: 'commonjs',
        fast: 'never',
        sourceMap: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-ts');
};
