const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

function task(userId) {
  return Promise.all([getUser(userId), getPosts(userId), getComments(userId)])
}

iterate(config.iterationsCount, [], task);