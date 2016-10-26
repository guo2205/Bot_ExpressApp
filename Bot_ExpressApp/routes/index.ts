 /*
 * GET home page.
 */
///<reference path="../Data.ts" />
import express = require('express');
import * as Data from "../Data";
import AIAgant = require('../AI/AIAgant');
import mysql = require('mysql');
import * as db from "../conf/db";
import * as dao from "../dao/UtilsDao";

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

export function SendTextMessage(req, res) {
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
            Data.Data.deviceCDKToFamilyId(req.query.deviceCDK, function (familyID: number) {
                if (familyID > 0) {
                    var AI = new AIAgant.Agent.AIAgent(req.query.deviceCDK, familyID);
                    AI.GetTextTouch(req.query.text)
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
export function GetMessage(req: express.Request, res: express.Response)
{
    var deviceCDK: string = req.query['deviceCDK'];
    Data.GetUnifiedJson(deviceCDK, function (resJson) {
        res.send(JSON.stringify(resJson));
    });
}
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
