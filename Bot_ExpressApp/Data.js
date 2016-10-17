"use strict";
var https = require('https');
var Data = (function () {
    function Data() {
    }
    Data.post = function (req, res) {
        //json = JSON.stringify(json);
        var message = {};
        var postheaders = {
            'Authorization': 'aUB1CCZl3oo.cwA.0_s.kbCafvoqzdCxk9gzgzkz8LV07_rVV9p948dUtW18c2w'
        };
        var option = {
            host: 'directline.botframework.com',
            port: 80,
            path: '/api/conversations',
            method: 'POST',
        };
        var reqPost = https.request(option, function (resPost) {
            resPost.setEncoding('utf8');
            resPost.on('data', function (d) {
                console.log(d);
            });
        });
        //reqPost.write(null);
        reqPost.end();
        reqPost.on('error', function (e) {
            console.error(e);
        });
        return message;
    };
    return Data;
}());
exports.Data = Data;
//# sourceMappingURL=Data.js.map