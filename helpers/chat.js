var Crypto = require("crypto");

var Database = require("./database");
var config = require("./config");
var Tools = require("./tools");

var createHash = function(user) {
    var sha256 = Crypto.createHash("sha256");
    sha256.update(user.hashpass || user.ip);
    return sha256.digest("hex");
};

module.exports.sendMessage = function(req, boardName, postNumber, text) {
    if (!text)
        return Promise.reject(Tools.translate("Message is empty"));
    if (!boardName)
        return Promise.reject(Tools.translate("Invalid board"));
    postNumber = +postNumber;
    if (!boardName || !postNumber || postNumber < 0)
        return Promise.reject(Tools.translate("Invalid post number"));
    var c = {};
    c.key = boardName + ":" + postNumber;
    c.senderHash = createHash(req);
    c.date = Tools.now();
    c.ttl = config("server.chat.ttl", 10080) * 60; //NOTE: 7 days
    return Database.getPost(boardName, postNumber).then(function(post) {
        if (!post)
            return Promise.reject(Tools.translate("No such post"));
        c.receiverHash = createHash(post.user);
        return Database.db.zrange("chat:" + c.key, 0, 0);
    }).then(function(msg) {
        if (msg && msg.length > 0 && JSON.parse(msg[0]).senderHash != c.senderHash
            && JSON.parse(msg[0]).receiverHash != c.senderHash) {
            return Promise.reject(Tools.translate("Somebody is chatting here already"));
        }
        return Database.db.sadd("chats:" + c.senderHash, c.key);
    }).then(function() {
        return Database.db.sadd("chats:" + c.receiverHash, c.key);
    }).then(function() {
        return Database.db.zadd("chat:" + c.key, +c.date.valueOf(), JSON.stringify({
            text: text,
            date: c.date.toISOString(),
            senderHash: c.senderHash,
            receiverHash: c.receiverHash
        }));
    }).then(function() {
        return Database.db.expire("chats:" + c.senderHash, c.ttl);
    }).then(function() {
        return Database.db.expire("chats:" + c.receiverHash, c.ttl);
    }).then(function() {
        return Database.db.expire("chat:" + c.key, c.ttl);
    }).then(function() {
        return Promise.resolve({});
    });
};

module.exports.getMessages = function(req, lastRequestDate) {
    lastRequestDate = +(new Date(lastRequestDate)).valueOf();
    if (!lastRequestDate)
        lastRequestDate = 0;
    var hash = createHash(req);
    var chats = {};
    var date = Tools.now().toISOString();
    return Database.db.smembers("chats:" + hash).then(function(keys) {
        var p = Promise.resolve();
        (keys || []).forEach(function(key) {
            p = p.then(function() {
                return Database.db.zrangebyscore("chat:" + key, lastRequestDate, Infinity).then(function(list) {
                    list = (list || []).map(function(msg) {
                        return JSON.parse(msg);
                    }).map(function(msg) {
                        return {
                            text: msg.text,
                            date: msg.date,
                            type: ((hash == msg.senderHash) ? "out" : "in")
                        };
                    });
                    if (list.length > 0)
                        chats[key] = list;
                });
            });
        });
        return p;
    }).then(function() {
        return Promise.resolve({
            lastRequestDate: date,
            chats: chats
        });
    });
};

module.exports.deleteMessages = function(req, boardName, postNumber) {
    if (!boardName)
        return Promise.reject(Tools.translate("Invalid board"));
    postNumber = +postNumber;
    if (!boardName || !postNumber || postNumber < 0)
        return Promise.reject(Tools.translate("Invalid post number"));
    var hash = createHash(req);
    return Database.db.del("chats:" + hash).then(function() {
        return Promise.resolve({});
    });
};
