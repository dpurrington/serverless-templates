const rp = require('request-promise');
const jwt = require('./jwt');

async function doWork() {
  // filter out things already having un-completed requests
}
module.exports = { doWork };

// this is to make development easier so you can just run directly from your command line
if (require.main === module) {
  doWork();
}
