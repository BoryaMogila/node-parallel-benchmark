const co = require('co');
const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

function task(userId) {
  return co(function * () {
    return yield {
      users: getUser(userId),
      posts: getPosts(userId),
      comments: getComments(userId),
    };
  })
}

iterate(config.iterationsCount, [], task);