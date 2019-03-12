module.exports = {
  database: {
    master: {
      host: 'localhost',
      user: 'root',
      password: '',
      port: '3306',
      database: 'pb',
      debug: false,
      connectionLimit: 10,
    },
  },
  usersCount: 2000000,
  postsCount: 4000000,
  commentsCount: 4000000,
  iterationsCount: 1000,
};