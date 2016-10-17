import https = require('https');
export class Data {
    static post(req, res): {} {
        //json = JSON.stringify(json);
        var message = {};
        var postheaders =
        {
            'Authorization': 'aUB1CCZl3oo.cwA.0_s.kbCafvoqzdCxk9gzgzkz8LV07_rVV9p948dUtW18c2w'
            //'Content-Type': 'application/json; charset=UTF-8',
            //'Content-Length': Buffer.byteLength(json, 'utf8')
        };
        var option =
        {
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

    }
}