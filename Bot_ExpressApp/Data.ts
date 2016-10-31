import https = require('https');
import http = require('http');
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
    }

    static httpsRequest(host: string, path: string, port: number, method: string, postheaders: {}, bady: {}, fun: Function) {
        var flg: boolean = false;
        var num: number = 0;
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
    }

    static deviceCDKToFamilyId(deviceCDK: string, fun: Function) {
        var userdao: dao.utilDao = new dao.utilDao();
        var para = new db.param();
        para.tableName = 'device';
        para.whereField = [{ key: 'deviceCDK', value: deviceCDK }];
        userdao.select(para, (obj: db.result) => {
            if (parseInt(obj.code) > 0) {
                fun(parseInt(obj.info[0].familyID));    
            }
            else
            {
                fun(0);
            }
        });
        
    }
}

export function GetUnifiedJson(deviceCDK: string, fun: Function) {
    var redis = new redisHelper.Redis(enumclass.RedisCollection.UserGetMessage);
    redis.GetList(deviceCDK, function (err, res: string[]) {
        var jsonres: Object[] = [];
        var jsonre: Object = null; 
        for (var index in res)
        {
            jsonre = JSON.parse(res[index]);
            jsonres.push(jsonre);
        }
        fun(jsonres);
        redis.DeleteData(deviceCDK, () => { });
        redis.Quit();
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