"use strict";
var https = require('https');
var Data = (function () {
    function Data() {
    }
    Data.httpRequest = function (host, path, port, method, postheaders, fun) {
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
        //reqPost.write(null);
        reqPost.end();
        reqPost.on('error', function (e) {
            console.error(e);
        });
    };
    return Data;
}());
exports.Data = Data;
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