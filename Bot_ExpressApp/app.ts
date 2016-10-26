///<reference path="SHD.ts" />

import express = require('express');
import routes = require('./routes/index');
import http = require('http');
import ejs = require('ejs');
import path = require('path');
import * as SHD from "./SHD";
import AIAgant = require('./AI/AIAgant');
import mysql = require('mysql');
import * as db from "./conf/db";
import * as dao from "./dao/UtilsDao";
var app = express();
var bot = new SHD.Bot();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

import stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
    
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//=========================================================
// GET Bind
//=========================================================
app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/bot', routes.bot);
app.get('/home', (req, res) => { var x = req.query.qq; res.send("qq" + x); });
app.get('/api/messages', (req, res) => { res.send("GET api/messages") });
app.get('/api/sendtextmessage', SendTextMessage);
app.get('/api/GetMessage', routes.GetMessage);

//=========================================================
// Post Bind
//=========================================================

app.post('/api/messages', bot.connector.listen());

//=========================================================
// Start Server
//=========================================================

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

import https = require('https');
import fs = require("fs");

var options = {
    key: fs.readFileSync('./zhengshu/2_lingfeng.me.key'),
    cert: fs.readFileSync('./zhengshu/1_lingfeng.me_bundle.crt')
};

https.createServer(options, app).listen(4444, function () {
    console.log('Https server listening on port ' + 4444);
});

//=========================================================
// static function
//=========================================================

function CheckPa(...args: string[]): boolean
{
    for (var i: number = 0; i < args.length; i++)
    {
        if (typeof args[i] == "undefined")
        {
            return true;
        }
    }
    return false;
}

/**
 * 
 * @param CDK
 * @param callback
 */
//function CheckCDK(CDK: string, callback) {
//    let userdao: dao.utilDao = new dao.utilDao();
//    let para = new db.param();
//    para.tableName = 'device';
//    para.whereField = [{ key: 'deviceCDK', value: CDK }];
//    userdao.select(para, (obj: db.result) => { callback });？
//}


//=========================================================
// GET function
//=========================================================

function SendTextMessage(req, res)
{
    let id: string;
    let familyId: string;
     
    if (CheckPa(req.query.status,req.query.deviceCDK, req.query.text))
    {
        res.send("10001");
        return;
    }

    //CheckCDK(req.query.cdk, (obj: db.result) =>
    //{
    //    let json: Object = JSON.parse(obj.info);
    //    id = json["id"];
    //    familyId = json["familyID"];
    //});
    switch (req.query.status)
    {
        case "1":
            var AI = new AIAgant.Agent.AIAgent(req.query.deviceCDK);
            AI.GetTextTouch(req.query.text)
            res.send("10000");
            break;
        default:
            res.send("10002");
            break;
    }
}


//=========================================================
// Post function
//=========================================================
