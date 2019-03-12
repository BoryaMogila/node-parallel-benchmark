const mysql = require('mysql2');
const config = require('config');

const pool = mysql.createPool(config.get('database.master'));


function getUser(userId, callback) {
  const q = 'select * from pb.users where id = ?';
  pool.query(q, [userId], callback);
}

function getPosts(userId, callback) {
  const q = 'select * from pb.posts where userId = ?';
  pool.query(q, [userId], callback);
}

function getComments(userId, callback) {
  const q = 'select * from pb.comments where userId = ?';
  pool.query(q, [userId], callback);
}

module.exports = {
  getUser, getPosts, getComments,
}


