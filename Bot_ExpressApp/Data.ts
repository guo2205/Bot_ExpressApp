import https = require('https');
export class Data {
    static httpRequest(host: string, path: string, port: number, method: string, postheaders: {}, bady: {}, fun: Function) {
        var flg: boolean = false;
        var num: number = 0;
        var option =
            {
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

    }
}
export class WebChatConfig
{
    static host: string = 'directline.botframework.com';
    static port: number = 443;
    static path: string = '/api/conversations';
    static method: string = 'POST';
    static postheaders =
    {
        'Authorization': 'BotConnector PtygZnH8Xvc.cwA.LRA.3O2kok04NHqnTAdUD1k3tEVvLEhphEt6WbDGQ5cWCj0',
        //'Content-Type': 'application/json; charset=UTF-8'
        //'Content-Length': Buffer.byteLength(json, 'utf8')
    };
}