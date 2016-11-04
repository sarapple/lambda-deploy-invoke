'use strict';

var nconf = require('nconf');
nconf
  .argv()
  .env()
  .file({ file:
    process.env.NODE_ENV + '.json'
  });
require('./gulp_tasks/default');
