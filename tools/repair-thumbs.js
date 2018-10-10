#!/usr/bin/env node

require('babel-polyfill');

const fileType = require('file-type');
const Path = require('path');
const FS = require('fs');

const util = require('util');
require('util.promisify').shim();
const promisify = util.promisify;

const readFile = promisify(FS.readFile);
const readdir = promisify(FS.readdir);
const stat = promisify(FS.stat);
const exists = promisify(FS.exists);
const rename = promisify(FS.rename);

process.on('unhandledRejection', p => {
  console.log('Unhandled Rejection:', p, p.stack);
});

(async () => {
  const mongodbClient = require('../server/storage/mongodb-client-factory').default;
  let client = mongodbClient();
  let Post = await client.collection('post');

  let path = Path.resolve(__dirname, '../public');
  let files = await readdir(path);

  for (let file of files) {
    let folderPath = Path.resolve(path, file);
    let stats = await stat(folderPath);
    if (stats.isDirectory()) {
      let thumbPath = Path.resolve(folderPath, 'thumb');
      try {
        if (exists(folderPath) && (await stat(thumbPath)).isDirectory()) {

          console.log(`Repairing ${folderPath}...`);
          await repairPNG(thumbPath, Post);
          console.log(`Repaired ${folderPath}.`);

        }
      } catch (e) {
        if (e.code === 'ENOENT'){
          console.log(`${thumbPath} doesn't exist, skipping...`);
        } else {
          console.log(e);
        }
      }
    }
  }

  console.log('Done.');
  process.exit(0);
})();

async function repairPNG(path, db) {
  let thumbs = await readdir(path);
  for (let thumb of thumbs) {
    await repairImage(path, thumb, db);
  }
}

async function repairImage(path, thumb, db) {
  let {ext, mime} = fileType(await readFile(Path.resolve(path, thumb)));
  let realExt = thumb.split('.')[1].toLowerCase();
  if (realExt !== ext && realExt !== mime.split('/')[1] && ext === 'png') {
    let dbEntry = await db.findOne({
      "fileInfos.thumb.name": thumb
    });
    if (dbEntry) {
      let thumbName = thumb.split('.')[0] + '.' + ext;
      console.log(`${thumb}, which is owned by /${dbEntry.boardName}/${dbEntry.number}, is repairing now. Thumb name become ${thumbName}.`);
      let index = dbEntry.fileInfos.findIndex(o => o.thumb.name === thumb);

      let $set = {};
      $set["dbEntry.fileInfos[" + index + "].thumb.name"] = thumbName;
      try {
        await rename(Path.resolve(path, thumb), Path.resolve(path, thumbName));

        await db.updateOne({
          _id: dbEntry._id
        }, {$set}, {upsert: false});
      } catch (e) {
        console.error(e.message);
      }
    } else {
      console.log('no entry!', dbEntry);
    }
  }
}
