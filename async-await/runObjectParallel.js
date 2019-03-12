const promiseAllObject = require('promise-all-object');
const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

function task(userId) {
  return promiseAllObject({
      users: getUser(userId),
      posts: getPosts(userId),
      comments: getComments(userId),
    });
}

iterate(config.iterationsCount, [], task);