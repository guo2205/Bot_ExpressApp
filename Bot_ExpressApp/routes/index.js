"use strict";
var Data = require("../Data");
var AIAgant = require('../AI/AIAgant');
function index(req, res) {
    var conversationRes = null;
    Data.Data.httpRequest(Data.WebChatConfig.host, Data.WebChatConfig.path, Data.WebChatConfig.port, Data.WebChatConfig.method, Data.WebChatConfig.postheaders, null, function (message) {
        var json = JSON.parse(message);
        var conversationId = json.conversationId;
        var token = json.token;
        var messagePath = Data.WebChatConfig.path + "/" + conversationId + "/messages";
        Data.Data.httpRequest(Data.WebChatConfig.host, messagePath, Data.WebChatConfig.port, "GET", Data.WebChatConfig.postheaders, null, function (message) {
            res.send(message);
        });
    });
}
exports.index = index;
;
function SendTextMessage(req, res) {
    if (Data.Data.CheckPa(req.query.status, req.query.deviceCDK, req.query.text)) {
        res.send("10001");
        return;
    }
    //CheckCDK(req.query.cdk, (obj: db.result) =>
    //{
    //    let json: Object = JSON.parse(obj.info);
    //    id = json["id"];
    //    familyId = json["familyID"];
    //});
    switch (req.query.status) {
        case "1":
            Data.Data.deviceCDKToFamilyId(req.query.deviceCDK, function (familyID) {
                if (familyID > 0) {
                    var AI = new AIAgant.Agent.AIAgent(req.query.deviceCDK, familyID);
                    AI.GetTextTouch(req.query.text);
                    res.send("10000");
                }
                else
                    res.send("10001");
            });
            break;
        default:
            res.send("10002");
            break;
    }
}
exports.SendTextMessage = SendTextMessage;
function GetMessage(req, res) {
    var deviceCDK = req.query['deviceCDK'];
    Data.GetUnifiedJson(deviceCDK, function (resJson) {
        res.send(JSON.stringify(resJson));
    });
}
exports.GetMessage = GetMessage;
function about(req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
}
exports.about = about;
;
function contact(req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
}
exports.contact = contact;
;
function bot(req, res) {
    res.render('bot.html');
}
exports.bot = bot;
;
/*
var bady = {
            "messages": [
                {
                    "conversation": conversationId,
                    "id": conversationId + "0000",
                    "text": "hello",
                    "from":
                }
            ]
        }
*/
//# sourceMappingURL=index.js.map