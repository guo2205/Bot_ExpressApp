import https = require('https');
import redisHelper = require("./DBH/RedisHelper");
import enumclass = require("./Enum");
import * as db from "./conf/db";
import * as dao from "./dao/UtilsDao";

export class Data {
    static CheckPa(...args: string[]): boolean {
        for (var i: number = 0; i < args.length; i++) {
            if (typeof args[i] == "undefined") {
                return true;
            }
        }
        return false;
    }

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

    static deviceCDKToFamilyId(deviceCDK: string, fun: Function) {
        var userdao: dao.utilDao = new dao.utilDao();
        var para = new db.param();
        para.tableName = 'device';
        para.whereField = [{ key: 'deviceCDK', value: deviceCDK }];
        userdao.select(para, (obj: db.result) => {
            if (parseInt(obj.code) > 0) {
                fun(0);
            }
            else
            {
                fun(parseInt(obj.info[0].familyID));
            }
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