const mysql = require('mysql2/promise');
const config = require('config');

const pool = mysql.createPool(config.get('database.master'));


function getUser(userId) {
  const q = 'select * from pb.users where id = ?';
  return pool.query(q, [userId]);
}

function getPosts(userId) {
  const q = 'select * from pb.posts where userId = ?';
  return pool.query(q, [userId]);
}

function getComments(userId) {
  const q = 'select * from pb.comments where userId = ?';
  return pool.query(q, [userId]);
}

module.exports = {
  getUser, getPosts, getComments,
};


