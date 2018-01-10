#!/usr/bin/env node

require('babel-polyfill');

const mongodbClient = require('../server/storage/mongodb-client-factory').default;

let mongo = mongodbClient();

let postsToDelete = new Set();
let threadsToDelete = new Set();

class SuperModel {

  constructor(type) {
    this.collection = type;
  }

  async count({whereKey, whereValue} = {}) {
    let Model = await mongo.collection(this.collection);

    let query = SuperModel.prepareQuery(whereKey, whereValue);

    return await Model.count(query);
  }

  async read({whereKey = null, whereValue, order = null, orderBy, limit = null, offset = null} = {}) {
    let Model = await mongo.collection(this.collection);

    let query = SuperModel.prepareQuery(whereKey, whereValue);

    let sortObject = null;

    if (order) {
      sortObject = {};
      sortObject[order] = (orderBy.toUpperCase() === 'ASC')
        ? 1
        : -1;
    }

    let options = {
      limit: limit,
      skip: offset,
      sort: sortObject
    };

    let out = await Model[limit === 1 ? 'findOne' : 'find'](query, options);

    let Cursor = require('mongodb/lib/cursor');
    if (out instanceof Cursor) {
      out = await out.toArray();
    }

    return out;
  }

  async update({whereKey = null, whereValue, fields} = {}) {
    let Model = await mongo.collection(this.collection);

    let query = SuperModel.prepareQuery(whereKey, whereValue);

    let type = ((query === null)
      ? fields.length
      : Object.keys(query).length) === 1
        ? 1
        : 0;

    return await Model[type === 1 ? 'updateOne' : 'updateMany'](query, {$set: fields}, {upsert: true});
  }

  async deleteOne(fields = {}) {
    let Model = await mongo.collection(this.collection);
    return await Model.deleteOne(fields);
  }

  async deleteMany(fields = {}) {
    let Model = await mongo.collection(this.collection);
    return await Model.deleteMany(fields);
  }

  static prepareQuery(whereKey, whereValue) {
    if (typeof whereKey === 'undefined' || whereKey === null) {
      return null;
    }
    if (!Array.isArray(whereKey)) {
      whereKey = [ whereKey ];

      if (!Array.isArray(whereValue)) {
        whereValue = [ whereValue ];
      }
    }
    let query = {};
    for (let i = 0; i < whereKey.length; i++) {
      if (typeof whereValue[i] === 'undefined') {
        continue;
      }
      query[whereKey[i]] = whereValue[i];
    }
    return query;
  }

}

async function postThread(i, count) {
  if (i >= count) {
    return true;
  }
  if (!(i % 10000)) {
    console.log(`Post-thread... ${i}/${count}`);
  }
  let posts = await Post.read({
    limit: limit,
    offset: i
  });
  posts.forEach(async (post) => {
    let count = await Thread.count({
      whereKey: ['boardName', 'number'],
      whereValue: [post.boardName, post.threadNumber]
    });
    if (!count) {
      let threadPost = await Post.read({
        whereKey: ['boardName', 'number'],
        whereValue: [post.boardName, post.threadNumber]
      });
      if (Array.isArray(threadPost) && threadPost.length) {
        console.log(`There's an OP-post: ${post.boardName}/${post.threadNumber}`);
        postsToDelete.add([post.boardName, post.threadNumber]);
      }
      console.log(`There's no such thread: ${post.boardName}/${post.threadNumber}`);
      postsToDelete.add([post.boardName, post.number]);
    }
    return count;
  });
  await postThread(i + limit, count);
}

async function threadPost(i, count) {
  if (i >= count) {
    return true;
  }
  if (!(i % 10000)) {
    console.log(`Thread-post... ${i}/${count}`);
  }
  let threads = await Thread.read({
    limit: limit,
    offset: i
  });
  threads.forEach(async (thread) => {
    let count = await Post.count({
      whereKey: ['boardName', 'threadNumber'],
      whereValue: [thread.boardName, thread.number]
    });
    if (!count) {
      console.log(`There's no posts: ${thread.boardName}/${thread.number}`);
      threadsToDelete.add([thread.boardName, thread.number]);
    }
    return count;
  });
  await threadPost(i + limit, count);
}

let Post = new SuperModel('post');
let Thread = new SuperModel('thread');
let limit = 100;

console.log('Starting...');
Thread.count().then(async (count) => {
  console.log('=== Resolving thread-post links... ===');
  await threadPost(0, count);
}).then(() => {
  return Post.count();
}).then(async (count) => {
  console.log('=== Resolving post-thread links... ===');
  await postThread(0, count);
}).then(async () => {
  console.log('=== Deleting orphan threads... ===');
  for (let thread of threadsToDelete) {
    console.log(`Deleting thread ${thread[0]}/${thread[1]}...`);
    let n = await Thread.deleteOne({
      boardName: thread[0],
      number: thread[1]
    });
    console.log(n.result);
  }
}).then(async () => {
  console.log('=== Deleting orphan posts... ===');
  for (let post of postsToDelete) {
    console.log(`Deleting post ${post[0]}/${post[1]}...`);
    let n = await Post.deleteOne({
      boardName: post[0],
      number: post[1]
    });
    if (n.result && n.result.n) {
      console.log(`${post[0]}/${post[1]} deleted.`);
    }
  }
}).then(() => {
  console.log('Done!');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
