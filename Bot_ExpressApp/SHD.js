"use strict";
///<reference path="DBH/RedisHelper.ts"/>
///<reference path="Enum.ts"/>
var builder = require('botbuilder');
var redisHelper = require("./DBH/RedisHelper");
var enumclass = require("./Enum");
var sss = enumclass.RedisCollection;
//=========================================================
// Bots
//=========================================================
var Bot = (function () {
    //=========================================================
    // Bots  Setup 
    //=========================================================
    function Bot() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        });
        this.DialogsBot = new builder.UniversalBot(this.connector);
        this.BindDialogs();
        this.BindLUIS();
    }
    //=========================================================
    // BindDialogs  Setup
    //=========================================================
    Bot.prototype.BindDialogs = function () {
        this.DialogsBot.dialog('/', function (session, args) { if (Bot.is)
            session.beginDialog('/LUIS');
        else
            session.beginDialog('/hello'); Bot.is = !Bot.is; });
        this.DialogsBot.dialog('/hello', function (session, args) { session.send("hello"); });
    };
    //=========================================================
    // LUISDialogs 中文  Setup
    //=========================================================
    Bot.prototype.BindLUIS = function () {
        var _this = this;
        var model = 'https://api.projectoxford.ai/luis/v1/application?id=b2317a11-6d3c-4882-84bf-2b60c7578717&subscription-key=177134f2b924409697183f32d513055a';
        var recognizer = new builder.LuisRecognizer(model);
        var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
        dialog.matches('QueryWeather', function (session, args) { _this.QueryWeatherIntenet(session, args); });
        dialog.matches('ControlDevice', builder.DialogAction.send('ControlDevice Alarm'));
        dialog.matches('None', [function (session) { builder.Prompts.text(session, 'Hi! What is your name?'); }, function (session, results) { session.send('Hello %s!', results.response); }]);
        dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));
        this.DialogsBot.dialog('/LUIS', dialog);
        var redis = new redisHelper.Redis(sss.Test);
        redis.SetString("123", "222", function (err, res) { console.log(res); });
        redis.Quit();
    };
    Bot.prototype.QueryWeatherIntenet = function (session, args) {
        var number = builder.EntityRecognizer.findEntity(args.entities, "builtin.number");
        var time = builder.EntityRecognizer.resolveTime(args.entities);
        if (number) {
            session.send("数字是" + number.entity);
            session.send("数字是" + number.entity);
        }
        else {
            session.send("没有数字");
        }
    };
    Bot.is = false;
    return Bot;
}());
exports.Bot = Bot;
//# sourceMappingURL=SHD.js.map