var express = require("express");

var controller = require("../helpers/controller");
var Tools = require("../helpers/tools");

var router = express.Router();

router.generateHTML = function() {
    var model = {};
    model.title = Tools.translate("Login", "loginButtonText");
    model.extraScripts = [
        { fileName: "3rdparty/sha1.min.js" },
        { fileName: "3rdparty/URI.min.js" },
        { fileName: "login.js" }
    ];
    return controller("login", model).then(function(data) {
        return Promise.resolve({ "login.html": data });
    });
};

module.exports = router;
