const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

function task(userId) {
  return getUser(userId).then(() => getPosts(userId)).then(() => getComments(userId))
}

iterate(config.iterationsCount, [], task);