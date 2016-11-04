'use strict'

const nconf = require('nconf');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const exec = require('child_process').exec;

function buildCommand(){
  //build the terminal command for invoking lambda function
  return "aws lambda invoke"
  + " --invocation-type RequestResponse"
  + " --function-name " + nconf.get('lambda:function')
  + " --region " + nconf.get('lambda:region')
  + " --log-type Tail"
  + " --payload file://" + nconf.get('lambda:request_file')
  + " --profile default " + nconf.get('lambda:response_file');
}

function logInfo(error, stdout, stderr){
  if (error)  gutil.log(gutil.colors.red('Error: ', error));
  if (stderr) gutil.log(gutil.colors.red('STDERR: ', stderr));
  if (stdout) {
    //log the output file, since the result is base64 encoded create a json file and read that
    gutil.log(
      gutil.colors.yellow(JSON.stringify(
        require(path.join('../', nconf.get('lambda:response_file'))),
        null,
        4
      ))
    );
  }
}

function spawnLambdaInvokeChild(){
  return new Promise(function(resolve, reject){
    exec(
      buildCommand(),
      function (error, stdout, stderr) {
        logInfo(error, stdout, stderr);
        if (error || stderr) return reject(stderr);

        return resolve(stdout);
      }
    );
  })
}

gulp.task('lambda:test', function(done){
  if (!nconf.get('lambda')) return done('lambda config not found. Add it to the [env].json file with lambda function, region, and request and response files');

  return spawnLambdaInvokeChild();
});
