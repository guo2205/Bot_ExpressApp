"use strict";
var https = require('https');
var http = require('http');
var redisHelper = require("./DBH/RedisHelper");
var enumclass = require("./Enum");
var db = require("./conf/db");
var dao = require("./dao/UtilsDao");
var Data = (function () {
    function Data() {
    }
    Data.CheckPa = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        for (var i = 0; i < args.length; i++) {
            if (typeof args[i] == "undefined") {
                return true;
            }
        }
        return false;
    };
    Data.httpRequest = function (host, path, port, method, postheaders, bady, fun) {
        var flg = false;
        var num = 0;
        var option = {
            host: host,
            port: port,
            path: path,
            method: method,
            headers: postheaders
        };
        var reqPost = http.request(option, function (resPost) {
            resPost.setEncoding('utf8');
            resPost.on('data', fun);
        });
        if (bady != null) {
            reqPost.write(JSON.stringify(bady));
        }
        reqPost.end();
        reqPost.on('error', function (e) {
            //console.error(e);
            fun(e);
        });
    };
    Data.httpsRequest = function (host, path, port, method, postheaders, bady, fun) {
        var flg = false;
        var num = 0;
        var option = {
            host: host,
            port: port,
            path: path,
            method: method,
            headers: postheaders
        };
        var reqPost = https.request(option, function (resPost) {
            resPost.setEncoding('utf8');
            resPost.on('data', fun);
        });
        if (bady != null) {
            reqPost.write(bady);
        }
        reqPost.end();
        reqPost.on('error', function (e) {
            console.error(e);
        });
    };
    Data.deviceCDKToFamilyId = function (deviceCDK, fun) {
        var userdao = new dao.utilDao();
        var para = new db.param();
        para.tableName = 'device';
        para.whereField = [{ key: 'deviceCDK', value: deviceCDK }];
        userdao.select(para, function (obj) {
            if (parseInt(obj.code) > 0) {
                fun(parseInt(obj.info[0].familyID));
            }
            else {
                fun(0);
            }
        });
    };
    return Data;
}());
exports.Data = Data;
function GetUnifiedJson(deviceCDK, fun) {
    var redis = new redisHelper.Redis(enumclass.RedisCollection.UserGetMessage);
    redis.GetList(deviceCDK, function (err, res) {
        var jsonres = [];
        var jsonre = null;
        for (var index in res) {
            jsonre = JSON.parse(res[index]);
            jsonres.push(jsonre);
        }
        fun(jsonres);
        redis.DeleteData(deviceCDK, function () { });
        redis.Quit();
    });
    /*
    redis.SetItemToList("123123", '{"co":"10000","txt":["' + testText + '"]}', (err, res) => {
        console.log(res);
        redis.Quit();
    });
    */
}
exports.GetUnifiedJson = GetUnifiedJson;
var WebChatConfig = (function () {
    function WebChatConfig() {
    }
    WebChatConfig.host = 'directline.botframework.com';
    WebChatConfig.port = 443;
    WebChatConfig.path = '/api/conversations';
    WebChatConfig.method = 'POST';
    WebChatConfig.postheaders = {
        'Authorization': 'BotConnector PtygZnH8Xvc.cwA.LRA.3O2kok04NHqnTAdUD1k3tEVvLEhphEt6WbDGQ5cWCj0',
    };
    return WebChatConfig;
}());
exports.WebChatConfig = WebChatConfig;
//# sourceMappingURL=Data.js.map