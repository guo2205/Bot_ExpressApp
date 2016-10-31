"use strict";
var Data = require("../Data");
var kBase = (function () {
    function kBase() {
    }
    kBase.prototype.kBase = function (str) {
        this.str = str;
    };
    kBase.prototype.fenci = function (fun) {
        var host = "http://localhost";
        var path = encodeURI("index.aspx?" + this.str);
        Data.Data.httpRequest(host, path, 53802, "GET", {}, {}, function () {
        });
    };
    return kBase;
}());
exports.kBase = kBase;
//# sourceMappingURL=Base.js.map