var Crypto = require("crypto");
var ReadLine = require("readline");
var ReadLineSync = require("readline-sync");

var Board = require("../boards/board");
var BoardModel = require("../models/board");
var config = require("./config");
var Database = require("./database");
var Global = require("./global");
var Tools = require("./tools");

var rl = ReadLine.createInterface({
    "input": process.stdin,
    "output": process.stdout
});

rl.setPrompt("ololord.js> ");

rl.tmp_question = rl.question;
rl.question = function(question) {
    return new Promise(function(resolve, reject) {
        rl.tmp_question.apply(rl, [question, resolve]);
    });
};

var handlers = {};

var _installHandler = function(cmd, f) {
    if (typeof cmd == "string") {
        handlers[cmd] = f;
    } else {
        cmd.forEach(function(cmd) {
            handlers[cmd] = f;
        });
    }
};

_installHandler(["quit", "q"], function() {
    process.exit(0);
    return Promise.resolve();
});

_installHandler(["respawn"], function(args) {
    var status = !isNaN(+args) ? +args : 0;
    return Global.IPC.send("exit", status, true).then(function() {
        return Promise.resolve("OK");
    });
});

_installHandler("help", function() {
    console.log(
        "Подробная информация: https://github.com/ololoepepe/ololord.js/wiki\n\n" +
        "█████ █   █ █   █ ████  ████ ████ █  █\n" +
        "  █   █   █ █   █ █  ██ █  █ █    █  █\n" +
        "  █   █   █ ██ ██ ████  ████ █    ████\n" +
        "  █   █   █ █ █ █ █  ██ █  █ █    █  █\n" +
        "  █   █████ █ █ █ ████  █  █ ████ █  █\n\n" +
        "Доступные команды:\n" +
        "q | quit - Выключить движок\n" +
        "help - Вывести эту справку\n" +
        "set <path> [значение] - Установить настройку (config.json). " +
        "Если значение не указано, то Вам будет предложено ввести его\n" +
        "get <path> - Отобразить настройку (config.json)\n" +
        "remove <path> - Удалить настройку (config.json)\n" +
        "register-user - Зарегистрировать нового пользователя\n" +
        "rerender-posts [board] - Регенерировать отображение постов [на выбранной доске]\n" +
        "stop - Закрыть все воркеры и предотвратить входящие соединения\n" +
        "start - Открыть воркеры для соединений\n" +
        "regenerate - Регенерировать кэш (при этом воркеры закроются и откроются!)\n" +
        "rebuild-search-index - Перестроить индекс поиска постов\n" +
        "uptime - Время работы движка");
    return Promise.resolve();
});

_installHandler("set", function(args) {
    var path = args.split(/\s+/)[0];
    var value = args.split(/\s+/).slice(1).join(" ");
    if (!path)
        return Promise.reject("Неверная команда. Введите 'help' для справки");
    if (value) {
        config.set(path, JSON.parse(value));
        return Promise.resolve("OK");
    }
    return rl.question("Введите значение для '" + path + "': ").then(function(answer) {
        config.set(path, (typeof answer == "string") ? answer : JSON.parse(answer));
        return Promise.resolve("OK");
    });
});

_installHandler("get", function(args) {
    if (!args)
        return Promise.reject(console.log("Неверная команда. Введите 'help' для справки"));
    var v = config(args);
    if (undefined == v)
        return Promise.reject("Такого значения нет!");
    return Promise.resolve("Значение для '" + args + "': " + JSON.stringify(v, null, 4));
});

_installHandler("remove", function(args) {
    if (!args)
        Promise.reject("Неверная команда. Введите 'help' для справки");
    config.remove(args);
    return Promise.resolve("OK");
});

_installHandler("register-user", function() {
    rl.pause();
    var password = ReadLineSync.question("Введите пароль: ", {
        hideEchoBack: true,
        mask: ""
    });
    if (password.length < 3)
        return Promise.reject("Пароль должен быть больше 3 символов!");
    var c = {};
    return rl.question("Enter level: USER | MODER | ADMIN\nYour choice: ").then(function(answer) {
        if (!Tools.contains(["USER", "MODER", "ADMIN"], answer))
            return Promise.reject("Invalid level");
        c.level = answer;
        return rl.question("Введите аббревиатуры досок для модерации.\n"
            + "Разделите их пробелами.\n"
            + "* - любая доска\n"
            + "Доски для модерации: ");
    }).then(function(answer) {
        c.boardNames = answer.split(/\s+/gi);
        if (!password.match(/^([0-9a-fA-F]){40}$/)) {
            var sha1 = Crypto.createHash("sha1");
            sha1.update(password);
            password = sha1.digest("hex");
        }
        var availableBoardNames = Board.boardNames();
        for (var i = 0; i < c.boardNames.length; ++i) {
            var boardName = c.boardNames[i];
            if ("*" != boardName && !Tools.contains(availableBoardNames, boardName))
                return Promise.reject("Неправильно указаны доски");
        }
        return rl.question("Введите IP пользователя. Или не вводите, хех.\n"
            + "Если несколько, то разделите их запятыми: [ip][,ip]...\n"
            + "IP: ");
    }).then(function(answer) {
        c.ips = answer ? answer.split(".") : [];
        return Database.registerUser(password, c.level, c.boardNames, c.ips);
    }).then(function() {
        return Promise.resolve("OK");
    });
});

_installHandler("rerender-posts", function(args) {
    var boards = Board.boardNames();
    if (args) {
        if (boards.indexOf(args) < 0)
            return Promise.reject("Неправильно указана доска!");
        boards = [args];
    }
    return rl.question("Уверен в этом? [yes/no][да/нет] ").then(function(answer) {
        answer = answer.toLowerCase();
        if (answer && answer != "yes" && answer != "y" && answer != "д" && answer != "да")
            return Promise.resolve();
        return Global.IPC.send("stop").then(function() {
            return Database.rerenderPosts(boards);
        }).then(function() {
            console.log("Генерация кэша...");
            return BoardModel.generate();
        }).then(function() {
            return Global.IPC.send("start");
        }).then(function() {
            return Promise.resolve("OK");
        });
    });
});

_installHandler("stop", function(args) {
    return Global.IPC.send("stop").then(function() {
        return Promise.resolve("OK");
    });
});

_installHandler("start", function(args) {
    return Global.IPC.send("start").then(function() {
        return Promise.resolve("OK");
    });
});

_installHandler("regenerate", function(args) {
    return Global.IPC.send("stop").then(function() {
        console.log("Генерация кэша...");
        return BoardModel.generate();
    }).then(function() {
        return Global.IPC.send("start");
    }).then(function() {
        return Promise.resolve("OK");
    });
});

_installHandler("rebuild-search-index", function(args) {
    return rl.question("Уверен в этом? [yes/no][да/нет] ").then(function(answer) {
        answer = answer.toLowerCase();
        if (answer && answer != "yes" && answer != "y" && answer != "д" && answer != "да")
            return Promise.resolve();
        return Database.rebuildSearchIndex().then(function() {
            return Promise.resolve();
        });
    });
});

_installHandler("uptime", function() {
    var format = function(seconds) {
        var pad = function(s) {
            return (s < 10 ? "0" : "") + s;
        }
        var days = Math.floor(seconds / (24 * 60 * 60));
        var hours = Math.floor(seconds % (24 * 60 * 60) / (60 * 60));
        var minutes = Math.floor(seconds % (60 * 60) / 60);
        var seconds = Math.floor(seconds % 60);
        return days + " days " + pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
    }
    return Promise.resolve(format(process.uptime()));
});

var init = function() {
    console.log("Движок запущен! Введите 'help' для справки");
    rl.prompt();
    rl.on("line", function(line, lineCount, byteCount) {
        if ("" == line)
            return rl.prompt();
        var cmd = "";
        var i = 0;
        for (; i < line.length; ++i) {
            if (line[i] == " ")
                break;
            cmd += line[i];
        }
        if (!handlers.hasOwnProperty(cmd)) {
            console.log("Неверная команда. Введите 'help' для справки");
            return rl.prompt();
        }
        rl.pause();
        handlers[cmd]((i < (line.length - 1)) ? line.substr(i + 1) : undefined).then(function(msg) {
            if (msg)
                console.log(msg);
            rl.resume();
            rl.prompt();
        }).catch(function(err) {
            Global.error(err.stack ? err.stack : err);
            rl.resume();
            rl.prompt();
        });
    }).on("error", function(err) {
        Global.error(err);
    });
    return rl;
};

init.installHandler = _installHandler;

module.exports = init;
