var callbackRead = require("read");
var Crypto = require("crypto");
var Util = require("util");

var Board = require("../boards/board");
var config = require("./config");
var controller = require("./controller");
var Database = require("./database");
var Global = require("./global");
var Tools = require("./tools");

read = function(prompt, options) {
    return new Promise(function(resolve, reject) {
        if (Util.isObject(prompt)) {
            options = prompt;
        } else {
            options = options || {};
            if (!options.prompt)
                options.prompt = prompt;
        }
        callbackRead(options, function(err, result) {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
};

var handlers = {};

read.installHandler = function(cmd, f) {
    if (typeof cmd == "string") {
        handlers[cmd] = f;
    } else {
        cmd.forEach(function(cmd) {
            handlers[cmd] = f;
        });
    }
};

read.installHandler(["quit", "q"], function() {
    process.exit(0);
    return Promise.resolve();
});

read.installHandler(["respawn"], function(args) {
    var status = !isNaN(+args) ? +args : 0;
    return Global.IPC.send("exit", status, true).then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("help", function() {
    console.log(
        "Подробная информация: https://github.com/ololoepepe/ololord.js/wiki\n\n" +
        "Сделано в России. 2016 rngnrs <rngnrs@yandex.ru>\n\n" +
        "█████ █   █ █   █ ████  █████ █████ █   █          ███     █   █ \n" +
        "  █   █   █ ██ ██ █   █ █   █ █     █   █         █   █   ██   █\n" +
        "  █   █   █ █ █ █ ████  █████ █     █████   █ █   █   █    █   ███\n" +
        "  █   █   █ █ █ █ █   █ █   █ █     █   █   █ █   █   █    █   █  █\n" +
        "  █   █████ █ █ █ ████  █   █ █████ █   █    █  █  ███  █  █   ███ \n\n" +
        "Доступные команды:\n" +
        "q | quit - Выключить движок\n" +
        "help - Вывести эту справку\n" +
        "set <path> [значение] - Установить настройку (config.json). " +
        "Если значение не указано, то Вам будет предложено ввести его\n" +
        "get <path> - Отобразить настройку (config.json)\n" +
        "remove <path> - Удалить настройку (config.json)\n" +
        "add-superuser - Зарегистрировать суперпользователя\n" +
        "remove-superuser - Удалить суперпользователя\n" +
        "rerender-posts [board] - Регенерировать отображение постов [на выбранной доске]\n" +
        "stop - Закрыть все воркеры и предотвратить входящие соединения\n" +
        "start - Открыть воркеры для соединений\n" +
        "regenerate - Регенерировать кэш (при этом воркеры закроются и откроются!)\n" +
        "reload-boards - Перезагрузить доски" +
        "reload-templates - Перезагрузить шаблоны и их части (включая те, которые находятся в /public/)\n" +
        "rebuild-search-index - Перестроить индекс поиска постов\n" +
        "uptime - Показать время работы движка");
    return Promise.resolve();
});

read.installHandler("set", function(args) {
    var path = args.split(/\s+/)[0];
    var value = args.split(/\s+/).slice(1).join(" ");
    if (!path)
        return Promise.reject("Неверная команда. Введите 'help' для справки");
    if (value) {
        config.set(path, JSON.parse(value));
        return Promise.resolve("OK");
    }
    return read("Введите значение для '" + path + "': ").then(function(answer) {
        config.set(path, (typeof answer == "string") ? answer : JSON.parse(answer));
        return Promise.resolve("OK");
    });
});

read.installHandler("get", function(args) {
    if (!args)
        return Promise.reject(console.log("Неверная команда. Введите 'help' для справки"));
    var v = config(args);
    if (undefined == v)
        return Promise.reject("Такого значения нет!");
    return Promise.resolve("Теперь значение для '" + args + "': " + JSON.stringify(v, null, 4));
});

read.installHandler("remove", function(args) {
    if (!args)
        Promise.reject("Неверная команда. Введите 'help' для справки");
    config.remove(args);
    return Promise.resolve("OK");
});

var requestPassword = function() {
    var c = {};
    console.log(Tools.translate("Enter password: "));
    return read({
        silent: true,
        replace: "*"
    }).then(function(password) {
        if (!password)
            return Promise.reject(Tools.translate("Invalid password"));
        c.password = password;
        if (!Tools.mayBeHashpass(password))
            return Promise.resolve();
        return read(Tools.translate("That is a hashpass, isn't it? [Yes/no]: "));
    }).then(function(result) {
        var notHashpass = (result || "").toLowerCase();
        notHashpass = (notHashpass && notHashpass != "yes" && notHashpass != "y");
        return Promise.resolve({
            password: c.password,
            notHashpass: notHashpass
        });
    });
};

read.installHandler("add-superuser", function() {
    var c = {};
    return requestPassword().then(function(result) {
        c.password = result.password;
        c.notHashpass = result.notHashpass;
        return read(Tools.translate("Enter superuser IP list (separate by spaces): "));
    }).then(function(result) {
        var ips = Tools.ipList(result);
        if (typeof ips == "string")
            return Promise.reject(ips);
        return Database.addSuperuser(c.password, ips, c.notHashpass);
    }).then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("remove-superuser", function() {
    return requestPassword().then(function(result) {
        return Database.removeSuperuser(result.password, result.notHashpass);
    }).then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("rerender-posts", function(args) {
    var boards = Board.boardNames();
    if (args) {
        if (boards.indexOf(args) < 0)
            return Promise.reject("Неправильно указана доска!");
        boards = [args];
    }
    return read("Уверен в этом? [yes/no][да/нет] ").then(function(answer) {
        answer = answer.toLowerCase();
        if (answer && answer != "yes" && answer != "y" && answer != "д" && answer != "да")
            return Promise.resolve();
        return Global.IPC.send("stop").then(function() {
            return Database.rerenderPosts(boards);
        }).then(function() {
            return controller.regenerate();
        }).then(function() {
            return Global.IPC.send("start");
        }).then(function() {
            return Promise.resolve("OK");
        });
    });
});

read.installHandler("stop", function(args) {
    return Global.IPC.send("stop").then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("start", function(args) {
    return Global.IPC.send("start").then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("regenerate", function(args) {
    return Global.IPC.send("stop").then(function() {
        return controller.regenerate();
    }).then(function() {
        return Global.IPC.send("start");
    }).then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("reload-boards", function(args) {
    return Global.IPC.send("stop").then(function() {
        Board.initialize();
        return Global.IPC.send("reloadBoards");
    }).then(function() {
        return Global.IPC.send("start");
    }).then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("reload-config", function(args) {
    return Global.IPC.send("stop").then(function() {
        if (args)
            config.setConfigFile(args);
        else
            config.reload();
        return Global.IPC.send("reloadConfig", args);
    }).then(function() {
        return Global.IPC.send("start");
    }).then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("reload-templates", function(args) {
    return Global.IPC.send("stop").then(function() {
        return controller.initialize();
    }).then(function() {
        return Global.IPC.send("start");
    }).then(function() {
        return Promise.resolve("OK");
    });
});

read.installHandler("rebuild-search-index", function(args) {
    return read("Уверен в этом? [yes/no][да/нет] ").then(function(answer) {
        answer = answer.toLowerCase();
        if (answer && answer != "yes" && answer != "y" && answer != "д" && answer != "да")
            return Promise.resolve();
        return Database.rebuildSearchIndex().then(function() {
            return Promise.resolve();
        });
    });
});

read.installHandler("uptime", function() {
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

module.exports = function() {
    console.log("Движок запущен! Введите 'help' для справки");
    var f = function() {
        return read("ololord.js> ").then(function(line) {
            if ("" == line)
                return f();
            var cmd = "";
            var i = 0;
            for (; i < line.length; ++i) {
                if (line[i] == " ")
                    break;
                cmd += line[i];
            }
            if (!handlers.hasOwnProperty(cmd)) {
                console.log("Неверная команда. Введите 'help' для справки");
                return f();
            }
            return handlers[cmd]((i < (line.length - 1)) ? line.substr(i + 1) : undefined).then(function(msg) {
                if (msg)
                    console.log(msg);
            }).catch(function(err) {
                console.log(err.stack ? err.stack : err);
            }).then(function() {
                return f();
            });
        });
    };
    f().catch(function(err) {
        console.log(err.stack ? err.stack : err);
    });
    return read;
};
