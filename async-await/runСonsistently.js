const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

async function task(userId) {
  await getUser(userId);
  await  getPosts(userId);
  await  getComments(userId);
  return
}

iterate(config.iterationsCount, [], task);