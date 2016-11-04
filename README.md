# Lambda Update and Invoke Gulp

This is a configurable setup for uploading updated lambda functions and invoking them via the AWS CLI and gulp.

## Dependencies

- [AWS CLI](https://aws.amazon.com/cli)
- npm dependencies (gulp4, node-zip, nconf, bluebird)
```
npm install
```

For this to work, you _must_ run gulp using gulp 4+.

## Configuration

- Setup your AWS keys in the AWS CLI per the [AWS CLI Docs](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html)

- Crate a config [env].json file like (dev.json).  Then set the NODE_ENV environment variable to the same name as the file when running gulp.

- The file example.json is added as an example for your configs if you had an _example_ environment.

- Add your lambda function in the __lambda__ folder. Then add the function name, function file name, region, filename, txt file of your lambad invocation request, and json target file for the response in your [env].json file.

```json
{
  "lambda" : {
    "function_file": "example.js",
    "request_file": "resources/request.txt",
    "response_file": "resources/response.json",
    "function" : "example",
    "region": "us-east-1"
  }
}
```

## Run Gulp

```bash
export NODE_ENV=dev && node ./node_modules/gulp/bin/gulp.js
```

## Todo

- Add testing
