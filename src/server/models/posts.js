import _ from 'underscore';
import FS from 'q-io/fs';

import * as BoardsModel from './boards';
import * as FilesModel from './files';
import * as ThreadsModel from './threads';
import * as UsersModel from './users';
import Board from '../boards/board';
import * as Renderer from '../core/renderer';
import * as Search from '../core/search';
import * as IPC from '../helpers/ipc';
import Logger from '../helpers/logger';
import * as Tools from '../helpers/tools';
import markup from '../markup';
import Hash from '../storage/hash';
import Key from '../storage/key';
import redisClient from '../storage/redis-client-factory';
import sqlClient from '../storage/sql-client-factory';
import UnorderedSet from '../storage/unordered-set';

let ArchivedPosts = new Hash(sqlClient(), 'archivedPosts');
let ArchivedReferringPosts = new Hash(sqlClient(), 'archivedReferringPosts');
let ArchivedReferencedPosts = new Hash(sqlClient(), 'archivedReferencedPosts');
let Posts = new Hash(redisClient(), 'posts');
let PostsPlannedForDeletion = new UnorderedSet(redisClient(), 'postsPlannedForDeletion', {
  parse: false,
  stringify: false
});
let ReferringPosts = new Hash(redisClient(), 'referringPosts');
let ReferencedPosts = new Hash(redisClient(), 'referencedPosts');
let UserBans = new Key(redisClient(), 'userBans');

function sortedReferences(references) {
  return _(references).toArray().sort((a, b) => {
    return (a.createdAt && b.createdAt && a.createdAt.localeCompare(b.createdAt))
      || a.boardName.localeCompare(b.boardName) || (a.postNumber - b.postNumber);
  }).map((reference) => {
    delete reference.createdAt;
    return reference;
  });
}

async function addDataToPost(board, post, { withExtraData, withFileInfos, withReferences } = {}) {
  let key = `${post.boardName}:${post.number}`;
  let ban = await UserBans.get(`${post.user.ip}:${post.boardName}`);
  post.bannedFor = !!(ban && ban.postNumber === post.number);
  if (withExtraData) {
    let extraData = await board.loadExtraData(post.number);
    post.extraData = extraData;
  }
  if (withFileInfos) {
    post.fileInfos = await FilesModel.getPostFileInfos(post.boardName, post.number, { archived: post.archived });
  }
  if (withReferences) {
    let referringSource = post.archived ? ArchivedReferringPosts : ReferringPosts;
    let referencedSource = post.archived ? ArchivedReferencedPosts : ReferencedPosts;
    let referringPosts = await referringSource.getAll(key);
    let referencedPosts = await referencedSource.getAll(key);
    post.referringPosts = sortedReferences(referringPosts);
    post.referencedPosts = sortedReferences(referencedPosts);
  }
}

export async function getPost(boardName, postNumber, options) {
  let board = Board.board(boardName);
  if (!board) {
    return Promise.reject(new Error(Tools.translate('Invalid board')));
  }
  postNumber = Tools.option(postNumber, 'number', 0, { test: Tools.testPostNumber });
  if (!postNumber) {
    return Promise.reject(new Error(Tools.translate('Invalid post number')));
  }
  let key = `${boardName}:${postNumber}`;
  let post = await Posts.getOne(key);
  if (!post) {
    post = await ArchivedPosts.getOne(key);
  }
  if (!post) {
    return post;
  }
  let threadPostNumbers = await ThreadsModel.getThreadPostNumbers(boardName, post.threadNumber);
  post.sequenceNumber = threadPostNumbers.indexOf(post.number) + 1;
  await addDataToPost(board, post, options);
  return post;
}

export async function getPosts(boardName, postNumbers, options) {
  let board = Board.board(boardName);
  if (!board) {
    return Promise.reject(new Error(Tools.translate('Invalid board')));
  }
  if (!_(postNumbers).isArray()) {
    postNumbers = [postNumbers];
  }
  postNumbers = postNumbers.map((postNumber) => {
    return Tools.option(postNumber, 'number', 0, { test: Tools.testPostNumber });
  });
  if (postNumbers.some(postNumber => !postNumber)) {
    return Promise.reject(new Error(Tools.translate('Invalid post number')));
  }
  let posts = await Posts.getSome(postNumbers.map(postNumber => `${boardName}:${postNumber}`));
  posts = _(posts).toArray();
  let mayBeArchivedPostNumbers = posts.map((post, index) => {
    return {
      post: post,
      index: index
    };
  }).filter((post) => !post.thread).map((post) => {
    return {
      index: post.index,
      postNumber: postNumbers[post.index]
    };
  });
  if (mayBeArchivedPostNumbers.length > 0) {
    let numbers = mayBeArchivedPostNumbers.map(post => post.postNumber);
    let archivedPosts = await ArchivedPosts.getSome(numbers.map(postNumber => `${boardName}:${postNumber}`));
    archivedPosts.forEach((post, index) => {
      posts[mayBeArchivedPostNumbers[index].index] = post;
    });
  }
  if (posts.length <= 0) {
    return [];
  }
  let uniqueThreadNumbers = _(posts.map(post => post.threadNumber)).uniq();
  let threadsPostNumbers = await Tools.series(uniqueThreadNumbers, async function(threadNumber) {
    return await ThreadsModel.getThreadPostNumbers(boardName, threadNumber);
  }, true);
  threadsPostNumbers = threadsPostNumbers.reduce((acc, list, index) => {
    acc[uniqueThreadNumbers[index]] = list;
    return acc;
  }, {});
  await Tools.series(posts, async function(post, index) {
    if (!post) {
      return;
    }
    post.sequenceNumber = threadsPostNumbers[post.threadNumber].indexOf(post.number) + 1;
    await addDataToPost(board, post, options);
  });
  return posts;
}

export async function getPostKeys({ archived, nonArchived } = {}) {
  let archivedKeys = [];
  let nonArchivedKeys = [];
  if (archived) {
    archivedKeys = await ArchivedPosts.keys();
  }
  if (nonArchived || (!archived && !nonArchived)) {
    nonArchived = await Posts.keys();
  }
  return nonArchived.concat(archived);
}

async function addReferencedPosts(post, referencedPosts, { nogenerate, archived } = {}) {
  let key = `${post.boardName}:${post.number}`;
  let referringSource = post.archived ? ArchivedReferringPosts : ReferringPosts;
  let referencedSource = post.archived ? ArchivedReferencedPosts : ReferencedPosts;
  //TODO: Optimise (hmset)
  await Tools.series(referencedPosts, async function(ref, refKey) {
    await referencedSource.setOne(refKey, ref, key);
    await referringSource.setOne(key, {
      boardName: post.boardName,
      postNumber: post.number,
      threadNumber: post.threadNumber,
      createdAt: refKey.createdAt
    }, refKey);
  });
  if (!nogenerate) {
    _(referencedPosts).each((ref, refKey) => {
      if (ref.boardName !== post.boardName || ref.threadNumber !== post.threadNumber) {
        IPC.render(ref.boardName, ref.threadNumber, ref.postNumber, 'edit');
      }
    });
  }
}

export async function createPost(req, fields, files, transaction, { postNumber, date } = {}) {
  let { boardName, threadNumber, text, markupMode, name, subject, sage, signAsOp, tripcode, password } = fields;
  threadNumber = Tools.option(threadNumber, 'number', 0, { test: Tools.testPostNumber });
  postNumber = Tools.option(postNumber, 'number', 0, { test: Tools.testPostNumber });
  let board = Board.board(boardName);
  if (!board) {
    return Promise.reject(new Error(Tools.translate('Invalid board')));
  }
  if (!board.postingEnabled) {
    return Promise.reject(new Error(Tools.translate('Posting is disabled at this board')));
  }
  date = date || Tools.now();
  if (postNumber) {
    threadNumber = postNumber;
  }
  let rawText = text || null;
  let markupModes = markup.markupModes(markupMode);
  let referencedPosts = {};
  sage = ('true' === sage);
  tripcode = ('true' === tripcode);
  signAsOp = ('true' === signAsOp);
  password = Tools.sha1(password);
  let hashpass = (req.hashpass || null);
  let thread = await ThreadsModel.getThread(boardName, threadNumber);
  if (!thread) {
    return Promise.reject(new Error(Tools.translate('No such thread')));
  }
  if (thread.closed) {
    return Promise.reject(new Error(Tools.translate('Posting is disabled in this thread')));
  }
  let unbumpable = !!thread.unbumpable;
  let accessLevel = req.level(boardName) || null;
  let postCount = await ThreadsModel.getThreadPostCount(boardName, threadNumber);
  if (postCount >= board.postLimit) {
    return Promise.reject(new Error(Tools.translate('Post limit reached')));
  }
  text = await markup(boardName, rawText, {
    markupModes: markupModes,
    referencedPosts: referencedPosts,
    accessLevel: accessLevel
  });
  let extraData = await board.postExtraData(req, fields, files);
  if (typeof extraData === 'undefined') {
    extraData = null;
  }
  if (!postNumber) {
    postNumber = await BoardsModel.nextPostNumber(boardName);
  }
  let plainText = text ? Renderer.plainText(text, { brToNewline: true }) : null;
  let post = {
    bannedFor: false,
    boardName: boardName,
    createdAt: date.toISOString(),
    geolocation: req.geolocationInfo,
    markup: markupModes,
    name: name || null,
    number: postNumber,
    options: {
      sage: sage,
      showTripcode: !!req.hashpass && tripcode,
      signAsOp: signAsOp
    },
    rawText: rawText,
    subject: subject || null,
    text: text || null,
    plainText: plainText,
    threadNumber: threadNumber,
    updatedAt: null,
    user: {
      hashpass: hashpass,
      ip: req.ip,
      level: accessLevel,
      password: password
    }
  };
  transaction.setPostNumber(postNumber);
  await Posts.setOne(`${boardName}:${postNumber}`, post);
  await board.storeExtraData(postNumber, extraData);
  await addReferencedPosts(post, referencedPosts);
  await UsersModel.addUserPostNumber(req.ip, boardName, postNumber);
  await FilesModel.addFilesToPost(boardName, postNumber, files);
  await Search.indexPost({
    boardName: boardName,
    postNumber: postNumber,
    threadNumber: threadNumber,
    plainText: plainText,
    subject: subject
  });
  await ThreadsModel.addThreadPostNumber(boardName, threadNumber, postNumber);
  if (!sage && postCount < board.bumpLimit && !unbumpable) {
    await ThreadsModel.setThreadUpdateTime(boardName, threadNumber, date.toISOString());
  }
  post.referencedPosts = referencedPosts;
  post.fileInfos = files;
  return post;
}

async function removeReferencedPosts({ boardName, number, threadNumber, archived }, { nogenerate } = {}) {
  let key = `${boardName}:${number}`;
  let referencedSource = archived ? ArchivedReferencedPosts : ReferencedPosts;
  let referringSource = archived ? ArchivedReferringPosts : ReferringPosts;
  let referencedPosts = await referencedSource.getAll(key);
  await Tools.series(referencedPosts, async function(ref, refKey) {
    return await referringSource.deleteOne(key, refKey);
  });
  if (!nogenerate) {
    _(referencedPosts).filter((ref) => {
      return (ref.boardName !== boardName) || (ref.threadNumber !== threadNumber);
    }).forEach((ref) => {
      IPC.render(ref.boardName, ref.threadNumber, ref.postNumber, 'edit');
    });
  }
  referencedSource.delete(key);
}

async function rerenderPost(boardName, postNumber, { nogenerate } = {}) {
  let post = await getPost(boardName, postNumber);
  if (!post) {
    return Promise.reject(new Error(Tools.translate('No such post')));
  }
  let referencedPosts = {};
  let text = await markup(boardName, post.rawText, {
    markupModes: post.markup,
    referencedPosts: referencedPosts,
    accessLevel: post.user.level
  });
  post.text = text;
  let source = post.archived ? ArchivedPosts : Posts;
  await source.setOne(`${boardName}:${postNumber}`, post);
  await removeReferencedPosts(post, { nogenerate: nogenerate });
  await addReferencedPosts(post, referencedPosts, {
    nogenerate: nogenerate,
    archived: post.archived
  });
  if (!nogenerate) {
    IPC.render(boardName, post.threadNumber, postNumber, 'edit');
  }
}

async function rerenderReferringPosts({ boardName, number, threadNumber, archived }, { removingThread } = {}) {
  let referringSource = archived ? ArchivedReferringPosts : ReferringPosts;
  let referringPosts = await referringSource.getAll(`${boardName}:${number}`);
  referringPosts = _(referringPosts).filter((ref) => {
    return !removingThread || ref.boardName !== boardName || ref.threadNumber !== threadNumber;
  });
  await Tools.series(referringPosts, async function(ref) {
    return await rerenderPost(ref.boardName, ref.postNumber);
  });
}

export async function removePost(boardName, postNumber, { removingThread, leaveReferences, leaveFileInfos } = {}) {
  let board = Board.board(boardName);
  if (!board) {
    return Promise.reject(new Error(Tools.translate('Invalid board')));
  }
  let key = `${boardName}:${postNumber}`
  await PostsPlannedForDeletion.addOne(key);
  let post = await getPost(boardName, postNumber, { withReferences: true });
  await ThreadsModel.removeThreadPostNumber(boardName, post.threadNumber, postNumber, { archived: post.archived });
  let source = post.archived ? ArchivedPosts : Posts;
  await source.deleteOne(key);
  if (!leaveReferences) {
    try {
      await rerenderReferringPosts(post, { removingThread: removingThread });
    } catch (err) {
      Logger.error(err.stack || err);
    }
    try {
      await removeReferencedPosts(post);
    } catch (err) {
      Logger.error(err.stack || err);
    }
  }
  await UsersModel.removeUserPostNumber(post.user.ip, boardName, postNumber);
  if (!leaveFileInfos) {
    FilesModel.removePostFileInfos(boardName, postNumber, { archived: post.archived });
  }
  await board.removeExtraData(postNumber);
  await Search.removePostIndex(boardName, postNumber);
  await PostsPlannedForDeletion.deleteOne(key);
}

export async function editPost(req, fields) {
  let { boardName, postNumber, text, name, subject, sage, markupMode } = fields;
  let board = Board.board(boardName);
  if (!board) {
    return Promise.reject(new Error(Tools.translate('Invalid board')));
  }
  postNumber = Tools.option(postNumber, 'number', 0, { test: Tools.testPostNumber });
  if (!postNumber) {
    return Promise.reject(new Error(Tools.translate('Invalid post number')));
  }
  let date = Tools.now();
  let rawText = text || null;
  let markupModes = markup.markupModes(markupMode);
  let referencedPosts = {};
  sage = ('true' === sage);
  let post = await getPost(boardName, postNumber, { withExtraData: true });
  if (!post) {
    return Promise.reject(new Error(Tools.translate('Invalid post')));
  }
  let key = `${boardName}:${postNumber}`;
  text = await markup(board.name, rawText, {
    markupModes: markupModes,
    referencedPosts: referencedPosts,
    accessLevel: req.level(board.name)
  });
  let plainText = text ? Renderer.plainText(text, { brToNewline: true }) : null;
  let extraData = await board.postExtraData(req, fields, null, post);
  if (post.hasOwnProperty('extraData')) {
    delete post.extraData;
  }
  if (post.hasOwnProperty('bannedFor')) {
    delete post.bannedFor;
  }
  post.markup = markupModes;
  post.name = name || null;
  post.plainText = plainText;
  post.rawText = rawText;
  post.subject = subject || null;
  post.text = text || null;
  post.updatedAt = date.toISOString();
  let source = post.archived ? ArchivedPosts : Posts;
  await source.setOne(key, post);
  await board.removeExtraData(postNumber);
  await board.storeExtraData(postNumber, extraData);
  await removeReferencedPosts(post);
  await addReferencedPosts(post, referencedPosts, { archived: post.archived });
  await Search.updatePostIndex(boardName, postNumber, (body) => {
    body.plainText = plainText;
    body.subject = subject;
    return body;
  });
  return post;
}

export async function deletePost(req, { boardName, postNumber, archived }) {
  let board = Board.board(boardName);
  if (!board) {
    return Promise.reject(new Error(Tools.translate('Invalid board')));
  }
  postNumber = Tools.option(postNumber, 'number', 0, { test: Tools.testPostNumber });
  if (!postNumber) {
    return Promise.reject(new Error(Tools.translate('Invalid post number')));
  }
  let post = await getPost(boardName, postNumber);
  if (!post) {
    return Promise.reject(new Error(Tools.translate('No such post')));
  }
  let isThread = post.threadNumber === post.number;
  archived = ('true' === archived);
  if (archived && !isThread) {
    return Promise.reject(new Error(Tools.translate('Deleting posts from archived threads is not allowed')));
  }
  if (isThread) {
    await removeThread(boardName, postNumber, { archived: archived });
  } else {
    await removePost(boardName, postNumber);
  }
  if (isThread && archived) {
    await Tools.series(['json', 'html'], async function(suffix) {
      return await FS.remove(`${__dirname}/../../public/${boardName}/arch/${postNumber}.${suffix}`);
    });
    await IPC.renderArchive(boardName);
  } else if (!archived) {
    await IPC.render(boardName, post.threadNumber, postNumber, isThread ? 'delete' : 'edit');
  }
}

async function forEachPost(targets, action) {
  if (typeof targets !== 'object') {
    return;
  }
  if (_(targets).toArray().length <= 0) {
    targets = Board.boardNames();
  }
  if (_(targets).isArray()) {
    targets = targets.reduce((acc, boardName) => {
      acc[boardName] = '*';
      return acc;
    }, {});
  }
  let postKeys = await getPostKeys({
    archived: true,
    nonArchived: true
  });
  postKeys = postKeys.reduce((acc, key) => {
    let [boardName, postNumber] = key.split(':');
    let set = acc.get(boardName);
    if (!set) {
      set = new Set();
      acc.set(boardName, set);
    }
    set.add(+postNumber);
    return acc;
  }, new Map());
  await Tools.series(targets, async function(postNumbers, boardName) {
    if (typeof postNumbers !== 'string' && !_(postNumbers).isArray()) {
      return;
    }
    if (!Board.board(boardName)) {
      Logger.error(new Error(Tools.translate('Invalid board name: $[1]', '', boardName)));
      return;
    }
    let set = postKeys.get(boardName);
    if ('*' === postNumbers) {
      postNumbers = set ? Array.from(set) : [];
    } else {
      postNumbers = set ? postNumbers.filter(postNumber => set.has(postNumber)) : [];
    }
    return await Tools.series(postNumbers, async function(postNumber) {
      try {
        return await action(boardName, postNumber);
      } catch (err) {
        Logger.error(err.stack || err);
      }
    });
  });
}

export async function rerenderPosts(targets) {
  return await forEachPost(targets, async function(boardName, postNumber) {
    console.log(Tools.translate('Rendering post: >>/$[1]/$[2]', '', boardName, postNumber));
    return await rerenderPost(boardName, postNumber, { nogenerate: true });
  });
}

async function rebuildPostSearchIndex(boardName, postNumber) {
  let key = `${boardName}:${postNumber}`;
  let post = await getPost(boardName, postNumber);
  await Search.updatePostIndex(boardName, postNumber, (body) => {
    body.plainText = post.plainText;
    body.subject = post.subject;
    body.archived = !!post.archived;
    return body;
  });
}

export async function rebuildSearchIndex(targets) {
  return await forEachPost(targets || {}, async function(boardName, postNumber) {
    console.log(Tools.translate('Rebuilding post search index: >>/$[1]/$[2]', '', boardName, postNumber));
    return await rebuildPostSearchIndex(boardName, postNumber);
  });
}

async function processMovedThreadPostReferences({ references, entity, sourceBoardName, targetBoardName, threadNumber,
  postNumberMap, toRerender, toUpdate }) {
  await Tools.series(references, async function(ref) {
    let nref;
    if (ref.boardName === sourceBoardName && ref.threadNumber === threadNumber) {
        nref = {
          boardName: targetBoardName,
          threadNumber: post.threadNumber,
          postNumber: postNumberMap[ref.postNumber]
        };
    } else {
      nref = ref;
      toUpdate[`${ref.boardName}:${ref.threadNumber}`] = {
        boardName: ref.boardName,
        threadNumber: ref.threadNumber
      };
      if (toRerender) {
        toRerender[`${ref.boardName}:${ref.postNumber}`] = {
          boardName: ref.boardName,
          postNumber: ref.postNumber
        };
      }
    }
    await entity.deleteOne(`${ref.boardName}:${ref.postNumber}`, `${sourceBoardName}:${oldPostNumber}`);
    await entity.setOne(`${nref.boardName}:${nref.postNumber}`, `${targetBoard.name}:${post.number}`, nref);
  });
}

export async function processMovedThreadPosts({ posts, postNumberMap, threadNumber, targetBoard, sourceBoardName,
  sourcePath, sourceThumbPath, targetPath, targetThumbPath }) {
  let toRerender = {};
  let toUpdate = {};
  await Tools.series(posts, async function(post) {
    let oldPostNumber = post.number;
    post.number = postNumberMap.get(post.number);
    post.threadNumber = threadNumber;
    post.boardName = targetBoard.name;
    let referencedPosts = post.referencedPosts;
    delete post.referencedPosts;
    let extraData = post.extraData;
    delete post.extraData;
    let referringPosts = post.referringPosts;
    delete post.referringPosts;
    let fileInfos = post.fileInfos;
    delete post.fileInfos;
    if (post.rawText) {
      _(postNumberMap).each((newPostNumber, previousPostNumber) => {
        let rx = new RegExp(`>>/${sourceBoardName}/${previousPostNumber}`, 'g');
        post.rawText = post.rawText.replace(rx, `>>/${targetBoard.name}/${newPostNumber}`);
        rx = new RegExp(`>>${previousPostNumber}`, 'g');
        post.rawText = post.rawText.replace(rx, `>>${newPostNumber}`);
      });
      referencedPosts.filter((ref) => { return ref.boardName === sourceBoardName; }).forEach((ref) => {
        let rx = new RegExp(`>>${ref.postNumber}`, 'g');
        post.rawText = post.rawText.replace(rx, `>>/${sourceBoardName}/${ref.postNumber}`);
      });
    }
    if (post.rawText) {
      post.text = await markup(targetBoard.name, post.rawText, {
        markupModes: post.markup,
        accessLevel: post.user.level
      });
    }
    let source = post.archived ? ArchivedPosts : Posts;
    await source.setOne(`${targetBoard.name}:${post.number}`, post);
    await targetBoard.storeExtraData(post.number, extraData);
    await processMovedThreadPostReferences({
      references: referencedPosts,
      entity: ReferencedPosts,
      sourceBoardName: sourceBoardName,
      targetBoardName: targetBoard.name,
      threadNumber: threadNumber,
      postNumberMap: postNumberMap,
      toUpdate: toUpdate
    });
    await processMovedThreadPostReferences({
      references: referringPosts,
      entity: ReferringPosts,
      sourceBoardName: sourceBoardName,
      targetBoardName: targetBoard.name,
      threadNumber: threadNumber,
      postNumberMap: postNumberMap,
      toRerender: toRerender,
      toUpdate: toUpdate
    });
    await UsersModel.addUserPostNumber(post.user.ip, targetBoard.name, post.number);
    await FilesModel.addFilesToPost(targetBoard.name, post.number, fileInfos, { archived: post.archived });
    await Tools.series(fileInfos, async function(fileInfo) {
      await FS.move(`${sourcePath}/${fileInfo.name}`, `${targetPath}/${fileInfo.name}`);
      await FS.move(`${sourceThumbPath}/${fileInfo.thumb.name}`, `${targetThumbPath}/${fileInfo.thumb.name}`);
    });
    await Search.indexPost(targetBoard.name, post.number, threadNumber, post.plainText, post.subject);
  });
  return {
    toRerender: toRerender,
    toUpdate: toUpdate
  };
}

export async function processMovedThreadRelatedPosts({ posts, sourceBoardName, postNumberMap }) {
  await Tools.series(posts, async function(post) {
    post = await getPost(post.boardName, post.postNumber);
    if (!post || !post.rawText) {
      return;
    }
    _(postNumberMap).each((newPostNumber, previousPostNumber) => {
      let rx = new RegExp(`>>/${sourceBoardName}/${previousPostNumber}`, 'g');
      post.rawText = post.rawText.replace(rx, `>>/${targetBoardName}/${newPostNumber}`);
      if (post.boardName === sourceBoardName) {
        rx = new RegExp(`>>${previousPostNumber}`, 'g');
        post.rawText = post.rawText.replace(rx, `>>/${targetBoardName}/${newPostNumber}`);
      }
    });
    post.text = await markup(post.boardName, post.rawText, {
      markupModes: post.markup,
      accessLevel: post.user.level
    });
    let source = post.archived ? ArchivedPosts : Posts;
    await source.setOne(`${post.boardName}:${post.number}`, post);
  });
}

export async function pushPostToArchive(boardName, postNumber) {
  let key = `${boardName}:${postNumber}`;
  let post = await Posts.getOne(key);
  post.archived = true;
  await ArchivedPosts.setOne(key, post);
  await Posts.deleteOne(key);
  await Search.updatePostIndex(boardName, postNumbers, (body) => {
    body.archived = true;
    return body;
  });
  await pushPostFileInfosToArchive(boardName, postNumber);
}
