﻿ /*
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
    res.render("chat.html");
};

export function SendTextMessage_post(req, res) {
    if (Data.Data.CheckPa(req.body.status, req.body.deviceCDK, req.body.text)) {
        res.send("10001");
        return;
    }
    console.log("req.body.status" + req.body.status);
    console.log("req.body.deviceCDK" + req.body.deviceCDK);
    console.log("req.body.text" + req.body.text);

    //CheckCDK(req.query.cdk, (obj: db.result) =>
    //{
    //    let json: Object = JSON.parse(obj.info);
    //    id = json["id"];
    //    familyId = json["familyID"];
    //});
    switch (req.body.status) {
        case "1":
            Data.Data.deviceCDKToFamilyId(req.body.deviceCDK, function (familyID: number) {
                if (familyID > 0) {
                    var AI = new AIAgant.Agent.AIAgent(req.body.deviceCDK, familyID);
                    AI.GetTextTouch(req.body.text)
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

export function GetMessage_post(req: express.Request, res: express.Response) {
    var deviceCDK: string = req.body.deviceCDK;
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
