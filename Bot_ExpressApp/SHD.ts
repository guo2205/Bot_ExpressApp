import builder = require('botbuilder');

//=========================================================
// Bots
//=========================================================
export class Bot {
    private appId: string; 
    private appPassword: string;
    public connector: builder.ChatConnector;
    private DialogsBot: builder.UniversalBot;


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
        //this.BindLUIS();
    }
    //=========================================================
    // BindDialogs  Setup
    //=========================================================

    private BindDialogs() {
        this.DialogsBot.dialog('/', (s) =>
        {
            s.send("hello");
        });
    }

    private BindLUIS()
    {
        var model = 'https://api.projectoxford.ai/luis/v1/application?id=b2317a11-6d3c-4882-84bf-2b60c7578717&subscription-key=177134f2b924409697183f32d513055a';
        var recognizer = new builder.LuisRecognizer(model);
        var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
        dialog.matches('QueryWeather', [(session, args, next) => { this.QueryWeatherIntenet(session, args, next); }, (session, results) => { this.QueryWeatherAction(session, results); }]);
        dialog.matches('ControlDevice', builder.DialogAction.send('ControlDevice Alarm'));
        dialog.onDefault(builder.DialogAction.send("I'm sorry I didn't understand. I can only create & delete alarms."));
        this.DialogsBot.dialog('/', dialog);
    }

    private QueryWeatherIntenet(session: builder.Session, args,next)
    {
        var number = builder.EntityRecognizer.findEntity(args.entities, "builtin.number");
        var time = builder.EntityRecognizer.resolveTime(args.entities);
        if (number)
        {
            builder.Prompts.text(session, number.entity);
        }
        else
        {
            next();
        }
    }

    private QueryWeatherAction(session: builder.Session, results) {
        builder.DialogAction.send("ok");
    }
}

