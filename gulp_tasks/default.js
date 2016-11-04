var gulp = require('gulp');

require('./lambda_deploy.js');
require('./lambda_test.js');

gulp.task(
  'default',
  gulp.series(
    'lambda:deploy',
    'lambda:test'
  )
);
