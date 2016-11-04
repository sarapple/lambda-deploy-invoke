'use strict'

var nconf = require('nconf');
var gulp = require('gulp');
var Promise = require("bluebird");
var Zip = require('node-zip');
const gutil = require('gulp-util');
const path = require('path');
const exec = require('child_process').exec;

//instantiate objects
var fsPromisified = new Promise.promisifyAll(require('fs'));

function buildCommand(){
  //build the terminal command for invoking lambda function
  return "aws lambda update-function-code"
  + " --function-name " + nconf.get('lambda:function')
  + " --zip-file fileb://converted.zip"
  + " --region " + nconf.get('lambda:region')
}

function logInfo(error, stdout, stderr){
  if (error)  gutil.log(gutil.colors.red('Error: ', error));
  if (stderr) gutil.log(gutil.colors.red('STDERR: ', stderr));
  if (stdout) gutil.log(gutil.colors.blue('STDOUT: ', stdout));
}

function zipLambdaFn(lambdaFn) {
  var zip = new Zip();

  zip.file('index.js', lambdaFn);
  var data = zip.generate({base64:false,compression:'DEFLATE'});

  return fsPromisified
    .writeFileAsync('./converted.zip', data, 'binary')
    .then(function(){
      return fsPromisified.readFileAsync('./converted.zip');
    });
}

function execLambdaUpdateChild(){
  return new Promise(function(resolve, reject){
    exec(
      buildCommand(),
      function (error, stdout, stderr) {
        logInfo(error, stdout, stderr);

        if (error)  return reject(error);
        if (stderr) return reject(stderr);

        return resolve(stdout);
      }
    );
  })
}

gulp.task('lambda:deploy', function(done){
  if (!nconf.get('lambda')) return done('lambda config not found. Add it to the [env].json file as a lambda key');

  return fsPromisified.readFileAsync('./lambda/' + nconf.get('lambda:function_file'))
    .then(zipLambdaFn)
    .then(execLambdaUpdateChild)
});
