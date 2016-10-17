"use strict";
var builder = require('botbuilder');
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
        //this.BindLUIS();
    }
    //=========================================================
    // BindDialogs  Setup
    //=========================================================
    Bot.prototype.BindDialogs = function () {
        this.DialogsBot.dialog('/', function (s) {
            s.send("hello");
        });
    };
    Bot.prototype.BindLUIS = function () {
        var _this = this;
        var model = 'https://api.projectoxford.ai/luis/v1/application?id=b2317a11-6d3c-4882-84bf-2b60c7578717&subscription-key=177134f2b924409697183f32d513055a';
        var recognizer = new builder.LuisRecognizer(model);
        var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
        dialog.matches('QueryWeather', [function (session, args, next) { _this.QueryWeatherIntenet(session, args, next); }, function (session, results) { _this.QueryWeatherAction(session, results); }]);
        dialog.matches('ControlDevice', builder.DialogAction.send('ControlDevice Alarm'));
        dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));
        this.DialogsBot.dialog('/', dialog);
    };
    Bot.prototype.QueryWeatherIntenet = function (session, args, next) {
        var number = builder.EntityRecognizer.findEntity(args.entities, "builtin.number");
        var time = builder.EntityRecognizer.resolveTime(args.entities);
        if (number) {
            builder.Prompts.text(session, number.entity);
        }
        else {
            next();
        }
    };
    Bot.prototype.QueryWeatherAction = function (session, results) {
        builder.DialogAction.send("ok");
    };
    return Bot;
}());
exports.Bot = Bot;
//# sourceMappingURL=SHD.js.map