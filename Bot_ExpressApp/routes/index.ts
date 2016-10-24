 /*
 * GET home page.
 */
///<reference path="../Data.ts" />
import express = require('express');
import * as Data from "../Data";

export function index(req: express.Request, res: express.Response) {
    var conversationRes: string = null;
    Data.Data.httpRequest(Data.WebChatConfig.host, Data.WebChatConfig.path, Data.WebChatConfig.port, Data.WebChatConfig.method, Data.WebChatConfig.postheaders, null, function (message) {
        var json = JSON.parse(message);
        var conversationId: string = json.conversationId;
        var token: string = json.token;
        var messagePath = Data.WebChatConfig.path + "/" + conversationId + "/messages";
        Data.Data.httpRequest(Data.WebChatConfig.host, messagePath, Data.WebChatConfig.port, "GET", Data.WebChatConfig.postheaders, null, function (message) {
            res.send(message);
        });
    });
};

export function about(req: express.Request, res: express.Response) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
};

export function contact(req: express.Request, res: express.Response) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};

export function bot(req: express.Request, res: express.Response) {
    res.render('bot.html');
};

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
