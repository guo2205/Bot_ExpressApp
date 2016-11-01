///<reference path="SHD.ts" />

import express = require('express');
import multiparty = require('multiparty');
import routes = require('./routes/index');
import connect = require('connect');
//import formidable = require('formidable');
import util = require('util');
import http = require('http');
import ejs = require('ejs');
import path = require('path');
import * as SHD from "./SHD";

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
app.get('/api/sendtextmessage', routes.SendTextMessage);
app.get('/api/getmessage', routes.GetMessage);
app.post('/api/sendtextmessage', routes.SendTextMessage_post);
app.post('/api/getmessage', routes.GetMessage_post);


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

/*上传*/
app.post('/uploading',
    function (req, res, next) {
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({ uploadDir: './public/log' });
        //var form = new formidable.IncomingForm();
        //上传处理
        form.parse(req,
            function (err, fields, files) {
                var filesTmp: string = JSON.stringify(files, null, 2);

                if (err) {
                    console.log('err:' + err);
                }
                else {
                    var inputFile = files.log[0];
                    var uploadedPath = inputFile.path;
                    var dstPath = 'public\\log\\' + inputFile.originalFilename;
                    //重命名为真实文件名
                    fs.rename(uploadedPath, dstPath,
                        function (err) {
                            if (err)
                                console.log('rename error:' + err);
                            else
                                console.log('rename ok');
                        }
                    );
                }
                res.writeHead(200, { 'content-type': 'text/h323' });
                console.log("123");
                res.end();
            }
        );
        form.on('error', function (err) {
            //console.log('Error parsing form: ' + err.stack);
        });
    }

);