///<reference path="../AI/AIAgant.ts" />
import AIagent = require("../AI/AIAgant");

export module Intent {
    export interface IIntent {
        name(): string;
        entityList(): Array<string>;
    }

    export interface LUISMainIntent
    {
        name:string;
        query:string;
        entities:LUISEntityData[];
    }

    export interface LUISData {
        query: string;
        intents: LUISIntentData[];
        entities: LUISEntityData[];
    } 

    export interface LUISIntentData
    {
        intent: string;
        score: number;
    } 

    export interface LUISEntityData {
        entity: string;
        type: string;
    }

    export class IntentMgr
    {

    //=========================================================
    // IntentMgr  pp 
    //=========================================================
        private IntentDict: Object;

    //=========================================================
    // IntentMgr  private 
    //=========================================================

        private BindIntent()
        {
            this.IntentDict =
                {
                None: (intentObject: LUISMainIntent, OnFinish: (SpeechCode: number, SpeechPa: Object) => void): string => { return this.None(intentObject, OnFinish) },
                QueryWeather: (intentObject: LUISMainIntent, OnFinish: (SpeechCode: number, SpeechPa: Object) => void): string => { return this.QueryWeather(intentObject, OnFinish) },
                Invalid: (intentObject: LUISMainIntent, OnFinish: (SpeechCode: number, SpeechPa: Object) => void): string => { return this.Invalid(intentObject, OnFinish) },
                };
        }

        //Intent None;
        private None(intentObject: LUISMainIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): string {
            console.log("IntentMgr log : Execute Intent None ");
            return "Execute Intent None "
        }

        //Intent QueryWeather;
        private QueryWeather(intentObject: LUISMainIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): string {
            console.log("IntentMgr log : Execute Intent QueryWeather " + intentObject);
            var SpeechPa_ = { "city": "上海", "t_max": 25, "t_min": 19 };
            callback(2023, SpeechPa_);
            return "Execute Intent None "
        }

        //Intent QueryWeather;
        private Invalid(intentObject: LUISMainIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): string {
            console.log("IntentMgr log : Execute Intent Invalid ");
            return "Execute Intent None "
        }

        private ControlDevice(intentObject: LUISMainIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): string {
            console.log("IntentMgr log : Execute Intent ControlDevice ");
            return "Execute Intent ControlDevice "
        }


        constructor()
        {
            this.BindIntent();
        }
    //=========================================================
    // IntentMgr  public 
    //=========================================================

        public CheckMainIntent(LUISstring: string): LUISMainIntent
        {
            var MainIntent: string = "None";
            var Maxscore: number = 0;
            var LUISJson: LUISData;
            var MainIntentObject: Object;
            try
            {
                LUISJson = JSON.parse(LUISstring);
                for (var i: number = 0; i < LUISJson.intents.length; i++)
                {
                    if (LUISJson.intents[i].score > Maxscore)
                    {
                        Maxscore = LUISJson.intents[i].score;
                        MainIntent = LUISJson.intents[i].intent;
                    }
                }
            }
            catch(e)
            {
                console.log("IntentMgr error : " + e.message);
                MainIntentObject=
                {
                    name:"Invalid",
                    query:LUISJson.query,
                    entities:LUISJson.entities
                };
                return MainIntentObject as LUISMainIntent;
            }

            MainIntentObject=
            {
                name:MainIntent,
                query:LUISJson.query,
                entities:LUISJson.entities
            };
            return MainIntentObject as LUISMainIntent;
        }

        public ExecuteIntent(intent: string, AIagentData: AIagent.Agent.IAIAgentData, intentObject: LUISMainIntent,callback: (SpeechCode: number, SpeechPa: Object) => void): string
        {
            if (!this.IntentDict.hasOwnProperty(intent))
            {
                console.log("IntentMgr error : " + intent +" Non-existent ");
                return;
            }
            return this.IntentDict[intent](intentObject,callback);
        }
    }
}


