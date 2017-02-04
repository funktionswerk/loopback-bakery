module.exports = function (grunt) {

  grunt.registerTask('test', [
    'clean',
    'ts:dev',
    'mochaTest'
  ]);

};
