var Address4 = require("ip-address").Address4;
var Address6 = require("ip-address").Address6;

var config = require("../helpers/config");
var controller = require("../helpers/controller");
var Tools = require("../helpers/tools");

module.exports = function(req, res, next) {
    var trueIp = req.ip;
    console.log(req.ip);
    if (!trueIp)
        return controller.error(req, res, 500, false);
    if (config("system.detectRealIp", true)) {
        var ip = req.headers["x-forwarded-for"];
        if (!ip)
            ip = req.headers["x-client-ip"];
        if (ip) {
            var address = new Address6(ip);
            if (!address.isValid())
                address = Address6.fromAddress4(new Address4(ip));
            if (!address.isValid())
                return controller.error(req, res, 500, false);
            trueIp = address.group();
        }
    }
    if (config("system.useXRealIp", false)) {
        var ip = req.headers["x-real-ip"];
        var address = new Address6(ip);
        if (!address.isValid())
            address = Address6.fromAddress4(new Address4(ip));
        if (!address.isValid()) {
            console.log("aaa");
            return controller.error(req, res, 500, false);
        }
        trueIp = address.group();
    }
    Object.defineProperty(req, "ip", { value: trueIp });
    next();
};
