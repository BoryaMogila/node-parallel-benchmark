const getRandomUserId = require('../helpers/getRandomId');
const _ = require('lodash');
const config = require('config');

const precision = 3;
let start = process.hrtime();

function elapsed_time(){
  const elapsed = process.hrtime(start)[1] / 1000000;
  return +elapsed.toFixed(precision);
};

module.exports = function iterate(count, arr = [], task) {
  if (!count) {
    console.log(arr, _.sum(arr) / arr.length);
    process.exit();
  }
  const userId = getRandomUserId();
  start = process.hrtime();
  task(userId).then(() => {
    if (config.iterationsCount !== count) arr.push(elapsed_time());
    iterate(count -1, arr, task)
  })
};