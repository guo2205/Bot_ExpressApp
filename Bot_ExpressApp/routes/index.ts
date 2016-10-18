/*
 * GET home page.
 */
///<reference path="../Data.ts" />
import express = require('express');
import * as Data from "../Data";

export function index(req: express.Request, res: express.Response) {
    var conversationRes: string = null;
    Data.Data.httpRequest(Data.WebChatConfig.host, Data.WebChatConfig.path, Data.WebChatConfig.port, Data.WebChatConfig.method, Data.WebChatConfig.postheaders, function (message) {
        var json = eval(message);
        var conversationId: string = json.conversationId;
        var token: string = json.token;
        Data.Data.httpRequest(Data.WebChatConfig.host, Data.WebChatConfig.path + "/" + conversationId + "/messages", Data.WebChatConfig.port, Data.WebChatConfig.method, Data.WebChatConfig.postheaders, function (message) {
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
