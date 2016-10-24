///<reference path="DBH/RedisHelper.ts"/>
///<reference path="Enum.ts"/>
import builder = require('botbuilder');
import * as redisHelper from "./DBH/RedisHelper";
import * as enumclass from "./Enum";

import Intent = require('./Intent/Iintent');

var sss = enumclass.RedisCollection;
//=========================================================
// Bots
//=========================================================
export class Bot {
    private appId: string; 
    private appPassword: string;
    public connector: builder.ChatConnector;
    private DialogsBot: builder.UniversalBot;
    static is: boolean = false;


    //=========================================================
    // Bots  Setup 
    //=========================================================

    constructor() {
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

    private BindDialogs() {
        this.DialogsBot.dialog('/', (session, args) => { if (Bot.is) session.beginDialog('/LUIS'); else session.beginDialog('/hello'); Bot.is = !Bot.is });
        this.DialogsBot.dialog('/hello', (session, args) => { session.send("hello");});
    }

    //=========================================================
    // LUISDialogs 中文  Setup
    //=========================================================
    private BindLUIS()
    {
        var model = 'https://api.projectoxford.ai/luis/v1/application?id=b2317a11-6d3c-4882-84bf-2b60c7578717&subscription-key=177134f2b924409697183f32d513055a';
        var recognizer = new builder.LuisRecognizer(model);
        var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
        dialog.matches('QueryWeather', (session, args) => { this.QueryWeatherIntenet(session, args); });
        dialog.matches('ControlDevice', builder.DialogAction.send('ControlDevice Alarm'));
        dialog.matches('None', [function (session) { builder.Prompts.text(session, 'Hi! What is your name?'); }, function (session, results) { session.send('Hello %s!', results.response); }]);
        dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));
        this.DialogsBot.dialog('/LUIS', dialog);

        var redis = new redisHelper.Redis(sss.Test);

        redis.SetString("123", "222", function (err, res) { console.log(res) });

        redis.Quit();
    }

    private QueryWeatherIntenet(session: builder.Session, args)
    {
        var number = builder.EntityRecognizer.findEntity(args.entities, "builtin.number");
        var time = builder.EntityRecognizer.resolveTime(args.entities);
        if (number)
        {
            session.send("数字是" + number.entity);
            session.send("数字是" + number.entity);
        }
        else
        {
            session.send("没有数字");
        }
    }
}

