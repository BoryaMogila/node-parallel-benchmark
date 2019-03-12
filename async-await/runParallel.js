const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

async function task(userId) {
  return await Promise.all([getUser(userId), getPosts(userId), getComments(userId)])
}

iterate(config.iterationsCount, [], task);