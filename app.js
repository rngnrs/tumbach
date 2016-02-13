#!/usr/bin/env node

var cluster = require("cluster");
var expressCluster = require("express-cluster");
var Log4JS = require("log4js");
var OS = require("os");

var Cache = require("./helpers/cache");
var config = require("./helpers/config");
var controller = require("./helpers/controller");
var BoardModel = require("./models/board");
var Database = require("./helpers/database");
var Global = require("./helpers/global");
var Tools = require("./helpers/tools");

Global.IPC = require("./helpers/ipc")(cluster);

var appenders = [];
var logTargets = config("system.log.targets", ["console", "file"]);
if (logTargets.indexOf("console") >= 0)
    appenders.push({ type: "console" });
if (logTargets.indexOf("console") >= 0) {
    appenders.push({
        type: "file",
        filename: __dirname + "/logs/ololord.log",
        maxLogSize: config("system.log.maxSize", 1048576),
        backups: config("system.log.backups", 100)
    });
}
Log4JS.configure({ appenders: appenders });
Global.logger = Log4JS.getLogger();
["trace", "debug", "info", "warn", "error", "fatal"].forEach(function(name) {
    Global[name] = function() {
        return Global.logger[name].apply(Global.logger, arguments);
    };
});

config.installSetHook("site.locale", Tools.setLocale);

var count = config("system.workerCount", OS.cpus().length);
if (count <= 0)
    count = OS.cpus().length;

var spawnCluster = function() {
    expressCluster(function(worker) {
        console.log("[" + process.pid + "] Initializing...");

        var express = require("express");

        var controller = require("./helpers/controller");

        var app = express();

        app.use(require("./middlewares"));
        app.use(require("./controllers"));
        app.use("*", function(req, res) {
            controller.notFound(res);
        });

        BoardModel.initialize().then(function() {
            return controller.initialize();
        }).then(function() {
            var sockets = {};
            var nextSocketId = 0;
            var server = app.listen(config("server.port", 8080), function() {
                console.log("[" + process.pid + "] Listening on port " + config("server.port", 8080) + "...");
                Global.IPC.installHandler("exit", function(status) {
                    process.exit(status);
                });
                Global.IPC.installHandler("stop", function() {
                    return new Promise(function(resolve, reject) {
                        server.close(function() {
                            console.log("[" + process.pid + "] Closed");
                            resolve();
                        });
                        Tools.forIn(sockets, function(socket, socketId) {
                            delete sockets[socketId];
                            socket.destroy();
                        });
                    });
                });
                Global.IPC.installHandler("start", function() {
                    return new Promise(function(resolve, reject) {
                        server.listen(config("server.port", 8080), function() {
                            console.log("[" + process.pid + "] Listening on port " + config("server.port", 8080)
                                + "...");
                            resolve();
                        });
                    });
                });
                Global.IPC.installHandler("doGenerate", function(data) {
                    var f = BoardModel[`do_${data.funcName}`];
                    if (typeof f != "function")
                        return Promise.reject("Invalid generator function");
                    return f.call(BoardModel, data.key, data.data);
                });
                Global.IPC.send("ready").catch(function(err) {
                    Global.error(err);
                });
            });
            server.on("connection", function(socket) {
                var socketId = ++nextSocketId;
                sockets[socketId] = socket;
                socket.on("close", function() {
                    delete sockets[socketId];
                });
            });
        }).catch(function(err) {
            Global.error(err);
        });
    }, {
        count: count,
        respawn: true
    });
};

if (cluster.isMaster) {
    Database.initialize().then(function() {
        return controller.initialize();
    }).then(function() {
        if (config("server.rss.enabled", true)) {
            setInterval(function() {
                BoardModel.generateRSS().catch(function(err) {
                    Global.error(err.stack || err);
                });
            }, config("server.rss.ttl", 60) * Tools.Minute);
        }
        if (config("system.regenerateCacheOnStartup", true))
            return controller.regenerate();
        return Promise.resolve();
    }).then(function() {
        console.log("Spawning workers, please, wait...");
        spawnCluster();
        var ready = 0;
        Global.IPC.installHandler("ready", function() {
            ++ready;
            if (ready == count) {
                var commands = require("./helpers/commands");
                var rl = commands();
            }
        });
        var fileNames = {};
        var fileName = function(boardName) {
            var fn = "" + Tools.now().valueOf();
            if (fn != fileNames[boardName]) {
                fileNames[boardName] = fn;
                return Promise.resolve(fn);
            }
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    fileName(boardName).then(function(fn) {
                        resolve(fn);
                    });
                }, 1);
            });
        };
        Global.IPC.installHandler("fileName", function(boardName) {
            return fileName(boardName);
        });
        Global.IPC.installHandler("generate", function(data) {
            return BoardModel.scheduleGenerate(data.boardName, data.threadNumber, data.postNumber, data.action);
        });
        Global.IPC.installHandler("generateArchive", function(data) {
            return BoardModel.scheduleGenerateArchive(data);
        });
    }).catch(function(err) {
        Global.error(err.stack || err);
        process.exit(1);
    });
} else {
    Global.generate = function(boardName, threadNumber, postNumber, action) {
        return Global.IPC.send("generate", {
            boardName: boardName,
            threadNumber: threadNumber,
            postNumber: postNumber,
            action: action
        }).catch(function(err) {
            Global.error(err.stack || err);
        });
    };
    Global.generateArchive = function(boardName) {
        return Global.IPC.send("generateArchive", boardName).catch(function(err) {
            Global.error(err.stack || err);
        });
    };
    spawnCluster();
}
