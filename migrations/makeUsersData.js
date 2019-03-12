const query = require('mysql-query-promise');
const faker = require('faker');
const _ = require('lodash');
const config = require('config');

const post = {
  "title": "Inline Styles for Basic Pseudo-Classes",
  "text": "My first blocker with inline-styles was pseudo-classes. I make lots of lists. So, I felt pretty exposed without :first-child() and friends.  Let’s try recreating some of these handy selectors using map().  What’s a map()? If you’re new to React, chances are you’ve already seen sample uses of map(). But maybe you’re not entirely sure what it does. Let’s step through it.  map() is a function called on an array  [1, 2, 3].map() map() takes a function as an argument  [1, 2, 3].map(function () {}); This function is called with each element in the array  [1, 2, 3].map(function (n) { return n }); // => function (1) { return 1 } // => function (2) { return 2 } // => function (3) { return 3 } A new array is then created — and returned — with all the new values  [1, 2, 3].map(function (n) { return n + 1 }); // => [2, 3, 4] Map also provides the index of each element  [1, 2, 3].map(function (n, i) { /* ... */ }); // => function (1, 0) // => function (2, 1) // => function (3, 2)"
};

const comment = {
  text: `How would you know if you’re at the last child? You must pass the array length as a prop into the child component I guess…`
};


async function createDB() {
  return await query('CREATE DATABASE IF NOT EXISTS `pb` DEFAULT CHARACTER SET utf8 ;');
}

async function createUsersTable() {
  return await query(`
    CREATE TABLE IF NOT EXISTS \`pb\`.\`users\` (
      \`id\` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`firstName\` VARCHAR(256) NULL DEFAULT NULL,
      \`lastName\` VARCHAR(256) NULL DEFAULT NULL,
    PRIMARY KEY (\`id\`),
    UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC))
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;
  `);
}

async function createPostsTable() {
  return await query(`
    CREATE TABLE IF NOT EXISTS \`pb\`.\`posts\` (
      \`id\` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`title\` TEXT NULL DEFAULT NULL,
      \`text\` TEXT NULL DEFAULT NULL,
      \`userId\` INT(10) UNSIGNED NOT NULL,
      PRIMARY KEY (\`id\`),
      INDEX \`fk_posts_users_idx\` (\`userId\` ASC),
      UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
      CONSTRAINT \`fk_posts_users\`
        FOREIGN KEY (\`userId\`)
        REFERENCES \`pb\`.\`users\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;
  `);
}

async function createCommentsTable() {
  return await query(`
    CREATE TABLE IF NOT EXISTS \`pb\`.\`comments\` (
      \`id\` INT(11) NOT NULL AUTO_INCREMENT,
      \`text\` TEXT NULL DEFAULT NULL,
      \`postId\` INT(10) UNSIGNED NOT NULL,
      \`userId\` INT(10) UNSIGNED NOT NULL,
      PRIMARY KEY (\`id\`, \`postId\`),
      INDEX \`fk_comments_posts1_idx\` (\`postId\` ASC),
      INDEX \`fk_comments_users1_idx\` (\`userId\` ASC),
      UNIQUE INDEX \`id_UNIQUE\` (\`id\` ASC),
      CONSTRAINT \`fk_comments_posts1\`
        FOREIGN KEY (\`postId\`)
        REFERENCES \`pb\`.\`posts\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,
      CONSTRAINT \`fk_comments_users1\`
        FOREIGN KEY (\`userId\`)
        REFERENCES \`pb\`.\`users\` (\`id\`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION)
    ENGINE = InnoDB
    DEFAULT CHARACTER SET = utf8;
  `);
}

async function makeUsers(count) {
  const users = new Array(count + 1).fill(null)
    .map(() => {
      return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      }
    });
  const forInsert = [...users];
  let i = 0;
  do {
    const users = forInsert.splice(0, 2000);
    const q = `insert into pb.users (id, firstName, lastName)
    values ${users.map(({ firstName, lastName }, id) => `(${(id + 1) + i * 2000}, "${firstName}", "${lastName}")`).join(',')}
    ON DUPLICATE KEY UPDATE firstName = values(firstName), lastName = values(lastName)`;
    await query(q);
    i++;
  } while (forInsert.length);
  return users;
}

async function makePosts({ users, count }) {
  const posts = new Array(count + 1).fill(null)
    .map(() => {
      const userId = _.random(1, users.length);
      return {
        ...post,
        userId,
      }
    });
  const forInsert = [...posts];
  let i = 0;
  do {
    const posts = forInsert.splice(0, 2000);
    const q = `insert into pb.posts (id, title, text, userId)
    values ${posts.map(({ title, text, userId }, id) => `(${(id + 1) + i * 2000}, "${title}", "${text}", ${userId})`).join(',')}
    ON DUPLICATE KEY UPDATE title = values(title), text = values(text), userId = values(userId) `;
    await query(q);
    i++;
  } while (forInsert.length);

  return posts;
}

async function makeComments({ users, posts, count }) {
  const comments = new Array(count + 1).fill(null)
    .map(() => {
      const userId = _.random(1, users.length);
      const postId = _.random(1, posts.length);
      return {
        ...comment,
        userId,
        postId,
      }
    });
  const forInsert = [...comments];
  let i = 0;
  do {
    const comments = forInsert.splice(0, 2000);
    const q = `insert into pb.comments (id, text, userId, postId)
    values ${comments.map(({ title, text, userId, postId }, id) => `(${(id + 1) + i * 2000}, "${text}", ${userId}, ${postId})`).join(',')}
    ON DUPLICATE KEY UPDATE text = values(text), userId = values(userId), postId = values(postId) `;
    await query(q);
    i++;
  } while (forInsert.length);

  return comments;
}

async function processData() {
  try {
    await createDB();
    await createUsersTable();
    await createPostsTable();
    await createCommentsTable();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  const users = await makeUsers(config.usersCount);
  const posts = await makePosts({ users, count: config.postsCount });
  await makeComments({ users, posts, count: config.commentsCount });
  process.exit(0);
}

processData();