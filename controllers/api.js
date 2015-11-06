//var BodyParser = require("body-parser");
//var Crypto = require("crypto");
var express = require("express");
var Util = require("util");

var Board = require("../boards");
var boardModel = require("../models/board");
var yandexCaptchas = require("../captchas/yandex-captcha").reduce(function(acc, captcha) {
    acc[captcha.id.split("-").pop()] = captcha;
    return acc;
}, {});
var controller = require("../helpers/controller");
var config = require("../helpers/config");
var Database = require("../helpers/database");
var Tools = require("../helpers/tools");

var router = express.Router();

//router.use(BodyParser.json());

var postIdentifiers = function(req, single) {
    if (!single) {
        var posts = req.query.posts;
        if (!posts)
            return [];
        if (Util.isString(posts))
            posts = [posts];
        return posts.map(function(post) {
            var boardName = post.split(":").shift();
            var postNumber = +post.split(":").pop();
            if (!boardName || isNaN(postNumber) || postNumber < 1)
                return null;
            return {
                boardName: boardName,
                postNumber: postNumber
            };
        });
    } else {
        var boardName = req.query.boardName;
        var postNumber = +req.query.postNumber;
        if (!boardName || isNaN(postNumber) || postNumber < 1)
            return [];
        return [ {
            boardName: boardName,
            postNumber: postNumber
        } ];
    }
};

var renderPost = function(req, post) {
    if (!post)
        return Promise.resolve(post);
    var board = Board.board(post.boardName);
    if (!board)
        return Promise.resolve(post);
    var p;
    if (post.threadNumber == post.number) {
        p = Promise.resolve([post]);
    } else {
        p = boardModel.getPosts([ {
            boardName: post.boardName,
            postNumber: post.threadNumber
        } ], req.hashpass);
    }
    return p.then(function(posts) {
        return board.renderPost(post, req, posts[0]);
    });
};

router.get("/posts.json", function(req, res) {
    var posts = postIdentifiers(req);
    boardModel.getPosts(posts, req.hashpass).then(function(posts) {
        var promises = posts.map(renderPost.bind(null, req));
        return Promise.all(promises);
    }).then(function(posts) {
        res.send(posts);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/post.json", function(req, res) {
    boardModel.getPosts(postIdentifiers(req, true), req.hashpass).then(function(posts) {
        return renderPost(req, posts[0]);
    }).then(function(post) {
        res.send(post);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/threadInfo.json", function(req, res) {
    var board = Board.board(req.query.boardName);
    var threadNumber = +req.query.threadNumber;
    boardModel.getThreadInfo(board, req.hashpass, threadNumber).then(function(thread) {
        res.send(thread);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/fileInfos.json", function(req, res) {
    boardModel.getFileInfos(req.query.fileNames, req.hashpass).then(function(fileInfos) {
        res.send(fileInfos);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/fileInfo.json", function(req, res) {
    boardModel.getFileInfos([req.query.fileName], req.hashpass).then(function(fileInfos) {
        res.send(fileInfos[0]);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/lastPosts.json", function(req, res) {
    var board = Board.board(req.query.boardName);
    var threadNumber = +req.query.threadNumber;
    var lastPostNumber = +req.query.lastPostNumber;
    boardModel.getLastPosts(board, req.hashpass, threadNumber, lastPostNumber).then(function(posts) {
        var promises = posts.map(renderPost.bind(null, req));
        return Promise.all(promises);
    }).then(function(posts) {
        res.send(posts);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/lastPostNumbers.json", function(req, res) {
    var boardNames = req.query.boardNames;
    if (boardNames && !Util.isArray(boardNames))
        boardNames = [boardNames];
    if (!boardNames)
        boardNames = Board.boardNames();
    boardModel.getLastPostNumbers(boardNames).then(function(lastPostNumbers) {
        var r = {};
        lastPostNumbers.forEach(function(lastPostNumber, i) {
            r[boardNames[i]] = lastPostNumber;
        });
        res.send(r);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/lastPostNumber.json", function(req, res) {
    boardModel.getLastPostNumbers([req.query.boardName]).then(function(lastPostNumbers) {
        res.json(lastPostNumbers[0]);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/captchaQuota.json", function(req, res) {
    Database.getUserCaptchaQuota(req.query.boardName, req.trueIp).then(function(quota) {
        res.json(quota);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

router.get("/yandexCaptchaImage.json", function(req, res) {
    var captcha = yandexCaptchas[req.query.type];
    if (!captcha)
        return controller.error(req, res, "Invalid captcha type", true);
    captcha.prepare(req, true).then(function(result) {
        res.send(result);
    }).catch(function(err) {
        controller.error(req, res, err, true);
    });
});

module.exports = router;
