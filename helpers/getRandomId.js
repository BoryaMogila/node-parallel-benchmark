const _ = require('lodash');
const config = require('config');

module.exports = function getRandomId () {
  return _.random(1, config.usersCount)
};