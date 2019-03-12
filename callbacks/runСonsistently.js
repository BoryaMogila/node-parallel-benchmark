const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

function task(userId, callback) {
  getUser(userId, (err, [user]) => {
    getPosts(userId, (err2, posts) => {
      getComments(userId, callback)
    })
  })
}

iterate(config.iterationsCount, [], task);