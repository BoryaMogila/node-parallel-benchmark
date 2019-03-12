const iterate = require('./iterate');
const { getUser, getPosts, getComments } = require('./getUserData');
const config = require('config');

function parallel (tasks, params = [], callback) {
  const res = [];
  let counter = 0;
  let errRes = [];
  tasks.map((task, i) => {
    task(...params, (err, result) => {
      counter++;
      if(err) {
        errRes.push(err);
      } else {
        res[i] = result;
      }
      if (counter === Object.keys(tasks).length) {
        callback(!errRes.length ? null : errRes, res);
      }
    })
  });
}

function task(userId, callback) {
  parallel([getUser, getPosts, getComments], [userId], callback)
}

iterate(config.iterationsCount, [], task);