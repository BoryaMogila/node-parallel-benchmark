const mysql = require('mysql2/promise');
const config = require('config');

const pool = mysql.createPool(config.get('database.master'));


async function getUser(userId) {
  const q = 'select * from pb.users where id = ?';
  return await pool.query(q, [userId]);
}

async function getPosts(userId) {
  const q = 'select * from pb.posts where userId = ?';
  return await pool.query(q, [userId]);
}

async function getComments(userId) {
  const q = 'select * from pb.comments where userId = ?';
  return await pool.query(q, [userId]);
}

module.exports = {
  getUser, getPosts, getComments,
};


