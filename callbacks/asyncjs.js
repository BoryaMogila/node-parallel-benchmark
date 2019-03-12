const async = require('async');
const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

function task(userId, callback) {
  async.parallel([
    (asyncCallback) => getUser(userId, asyncCallback),
    (asyncCallback) => getPosts(userId, asyncCallback),
    (asyncCallback) => getComments(userId, asyncCallback)
  ], callback);
}

iterate(config.iterationsCount, [], task);