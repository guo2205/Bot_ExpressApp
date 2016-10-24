﻿import https = require('https');
import redisHelper = require("./DBH/RedisHelper");
import enumclass = require("./Enum");
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

export function GetUnifiedJson(deviceCDK: string, fun: Function) {
    var redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
    redis.GetList(deviceCDK, function (err, res: string[]) {
        redis.RemoveData(deviceCDK, () => { });
        redis.Quit();
        var arrayCode: number[] = [];
        var arrayText: string[] = [];
        var arrayTime: string[] = [];
        for (var i = 0; i < res.length; i++) {
            var json: { co: number; txt: string; clientTime: string; } = JSON.parse(res[i]);
            arrayCode.push(json.co);
            arrayText.push(json.txt);
            if (json.clientTime != undefined)
                arrayTime.push(json.clientTime);
            else
                arrayTime.push('');
        }
        var resJson = { 'co': arrayCode, 'txt': arrayText, 'time': arrayTime };
        fun(resJson);

    });
    /*
    redis.SetItemToList("123123", '{"co":"10000","txt":["' + testText + '"]}', (err, res) => {
        console.log(res);
        redis.Quit();
    });
    */
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