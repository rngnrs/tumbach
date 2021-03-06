#!/usr/bin/env node

var CSV = require("fast-csv");
var FS = require("fs");
var mkpath = require("mkpath");
var promisify = require("promisify-node");
var SQLite3 = require("sqlite3");

var path = process.argv[2];

if (!FS.existsSync(path)) {
    console.log("Неверный путь");
    process.exit(0);
}

var dbPath = __dirname + "/../geolocation";

mkpath.sync(dbPath);

var db = new SQLite3.Database(dbPath + "/ip2location.sqlite");
db.pexec = promisify(db.exec);
db.prun = promisify(db.run);
var stream = FS.createReadStream(path, "utf8");

console.log("Начало транзакции...");

db.pexec("BEGIN").then(function () {
    console.log("Создание таблицы...");
    return db.prun("CREATE TABLE IF NOT EXISTS ip2location(ipFrom INTEGER, "
        + "ipTo INTEGER, "
        + "countryCode TEXT, "
        + "countryName TEXT, "
        + "regionName TEXT, "
        + "cityName TEXT)");
}).then(function() {
    console.log("Создание индекса...");
    return db.prun("CREATE INDEX indexIpTo ON ip2location(ipTo)");
}).then(function() {
    console.log("Заполнение базы данных...");
    return new Promise(function(resolve, reject) {
        CSV.fromStream(stream, {
            headers: ["ipFrom", "ipTo", "countryCode", "countryName", "regionName", "cityName", "_", "_", "_", "_",
                "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_", "_"], //Supporting IP2Location-DB24
            ignoreEmpty: true
        }).on("data", function(data) {
            if (!data.countryCode || "-" === data.countryCode)
                return;
            if ("-" === data.countryName)
                data.countryName = null;
            if ("-" === data.regionName)
                data.regionName = null;
            if ("-" === data.cityName)
                data.cityName = null;
            var stmt = db.prepare("INSERT INTO ip2location VALUES(?, ?, ?, ?, ?, ?)");
            stmt.prun = promisify(stmt.run);
            stmt.prun(data.ipFrom, data.ipTo, data.countryCode, data.countryName, data.regionName,
                data.cityName).then(function() {
                stmt.finalize();
            });
        }).on("end", function() {
            resolve();
        });
    });
}).then(function() {
    console.log("Подтверждение транзакции...");
    return db.pexec("COMMIT");
}).then(function() {
    console.log("Готово!");
    process.exit(0);
}).catch(function(err) {
    console.log(err);
    db.pexec("ROLLBACK").then(function() {
        process.exit(0);
    });
});
