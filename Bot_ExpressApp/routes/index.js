"use strict";
var Data = require("../Data");
function index(req, res) {
    var conversationRes = null;
    Data.Data.httpRequest(Data.WebChatConfig.host, Data.WebChatConfig.path, Data.WebChatConfig.port, Data.WebChatConfig.method, Data.WebChatConfig.postheaders, function (message) {
        var json = eval(message);
        var conversationId = json.conversationId;
        var token = json.token;
        Data.Data.httpRequest(Data.WebChatConfig.host, Data.WebChatConfig.path + "/" + conversationId + "/messages", Data.WebChatConfig.port, Data.WebChatConfig.method, Data.WebChatConfig.postheaders, function (message) {
            res.send(message);
        });
    });
}
exports.index = index;
;
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
//# sourceMappingURL=index.js.map