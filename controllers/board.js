var express = require("express");
var FS = require("q-io/fs");
var merge = require("merge");
var Util = require("util");

var Board = require("../boards");
var Captcha = require("../captchas");
var BoardModel = require("../models/board");
var config = require("../helpers/config");
var controller = require("../helpers/controller");
var Database = require("../helpers/database");
var Tools = require("../helpers/tools");

var router = express.Router();

router.get("/:boardName", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404);
    controller.checkBan(req, res, board.name).then(function() {
        controller.sendCachedHTML(req, res, `page-${board.name}-0`);
    }).catch(function(err) {
        controller.error(res, err);
    });
});

router.get("/:boardName/catalog.html", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404);
    controller.checkBan(req, res, board.name).then(function() {
        var sortMode = (req.query.sort || "date").toLowerCase();
        if (["recent", "bumps"].indexOf(sortMode) < 0)
            sortMode = "date";
        controller.sendCachedHTML(req, res, `catalog-${sortMode}-${board.name}`);
    }).catch(function(err) {
        controller.error(res, err);
    });
});

router.get("/:boardName/catalog.json", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404, true);
    var c = {};
    controller.checkBan(req, res, board.name).then(function() {
        var sortMode = (req.query.sort || "date").toLowerCase();
        if (["recent", "bumps"].indexOf(sortMode) < 0)
            sortMode = "date";
        controller.sendCachedJSON(req, res, `catalog-${sortMode}-${board.name}`);
    }).catch(function(err) {
        controller.error(res, err, true);
    });
});

router.get("/:boardName/archive.html", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404);
    controller.checkBan(req, res, board.name).then(function() {
        controller.sendCachedHTML(req, res, `archive-${board.name}`);
    }).catch(function(err) {
        controller.error(res, err);
    });
});

router.get("/:boardName/archive.json", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404, true);
    var c = {};
    controller.checkBan(req, res, board.name).then(function() {
        var model = {};
        var path = `${__dirname}/../public/${board.name}/arch`;
        return FS.exists(path).then(function(exists) {
            if (!exists)
                return Promise.resolve([]);
            return FS.list(path);
        }).then(function(fileNames) {
            model.threads = fileNames.map(function(fileName) {
                return {
                    boardName: board.name,
                    number: +fileName.split(".").shift()
                };
            });
            return Database.lastPostNumber(board.name);
        }).then(function(lastPostNumber) {
            model.lastPostNumber = lastPostNumber;
            model.postingSpeed = controller.postingSpeedString(board, lastPostNumber);
            res.send(model);
        });
    }).catch(function(err) {
        controller.error(res, err, true);
    });
});

router.get("/:boardName/rss.xml", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404);
    var c = {};
    controller.checkBan(req, res, board.name).then(function() {
        controller.sendCachedRSS(req, res, board.name);
    }).catch(function(err) {
        controller.error(res, err);
    });
});

router.get("/:boardName/:page.html", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404);
    controller.checkBan(req, res, board.name).then(function() {
        controller.sendCachedHTML(req, res, `page-${board.name}-${req.params.page}`);
    }).catch(function(err) {
        controller.error(res, err);
    });
});

router.get("/:boardName/:page.json", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404, true);
    var c = {};
    controller.checkBan(req, res, board.name).then(function() {
        controller.sendCachedJSON(req, res, `page-${board.name}-${req.params.page}`);
    }).catch(function(err) {
        controller.error(res, err, true);
    });
});

router.get("/:boardName/res/:threadNumber.html", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404);
    controller.checkBan(req, res, board.name).then(function() {
        controller.sendCachedHTML(req, res, `thread-${board.name}-${req.params.threadNumber}`);
    }).catch(function(err) {
        controller.error(res, err);
    });
});

router.get("/:boardName/res/:threadNumber.json", function(req, res) {
    var board = Board.board(req.params.boardName);
    if (!board)
        return controller.error(res, 404, true);
    var c = {};
    controller.checkBan(req, res, board.name).then(function() {
        controller.sendCachedJSON(req, res, `thread-${board.name}-${req.params.threadNumber}`);
    }).catch(function(err) {
        controller.error(res, err, true);
    });
});

router.generateHTML = function() {
    var result = {};
    return Tools.series(Board.boardNames(), function(boardName) {
        var board = Board.board(boardName);
        var model = {};
        model.title = board.title;
        model.isBoardPage = true;
        model.board = controller.boardModel(board).board;
        model.tr = controller.translationsModel();
        return controller("archivePage", model).then(function(data) {
            result[`archive-${boardName}`] = data;
        });
    }).then(function() {
        return Promise.resolve(result);
    });
};

router.generateJSON = function() {
    return BoardModel.generateJSON();
};

module.exports = router;
