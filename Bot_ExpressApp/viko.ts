import express = require('express');
import multiparty = require('multiparty');
import https = require('https');
//import formidable = require('formidable');
import util = require('util');
import fs = require('fs');
import path = require('path');
import http = require('http');
import routes = require('./routes/index');

let router = new express.Router();
let app = express();

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


/* 上传页面 */
app.get('/', routes.index);
app.get('/111', (req, res) => {res.send("qq"); });

/* 创建服务 */
http.createServer(app).listen(7777, function () {
    console.log('Express server listening on port ' + 7777);
});;
var options = {
    key: fs.readFileSync('./zhengshu/2_lingfeng.me.key'),
    cert: fs.readFileSync('./zhengshu/1_lingfeng.me_bundle.crt')
};

https.createServer(options, app).listen(4444, function () {
    console.log('Https server listening on port ' + 4444);
});


/*上传*/
app.post('/uploading',
    function (req, res, next)
    {
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({ uploadDir: './public/picture' });
        //var form = new formidable.IncomingForm();
        //上传处理
        form.parse(req,
            function (err, fields, files)
            {
                var filesTmp: string = JSON.stringify(files, null, 2);

                if (err)
                {
                    console.log('err:' + err);
                }
                else
                {
                    var inputFile = files.photo[0];
                    var uploadedPath = inputFile.path;
                    var dstPath = 'public\\log\\' + inputFile.originalFilename;
                    //重命名为真实文件名
                    fs.rename(uploadedPath, dstPath ,
                        function (err)
                        {
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
module.exports = router;