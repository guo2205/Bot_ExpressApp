﻿///<reference path="../AI/AIAgant.ts" />
import AIagent = require("../AI/AIAgant");
import * as IntentObject from "./Intent";
import IEntity = require("../Entity/IEntity");
import Action = require("../Action/IAction");
import redisHelper = require("../DBH/RedisHelper");
import enumclass = require("../Enum");

export module Intent {
    export interface IAIIntent
    {
        
        Intent: string;
        entity: string[];
    }
 
    export interface IIntent {
        name(): string;
        entities: Object; //{ "city": new Entity.Entity.Entity_City(), "data": new Entity.Entity.Entity_Data() }
        actions: Object;  //{ "weather": new Action.Action.action_Weather() }
        execute: Object;  //{"enter": "city","city": ["data", 2003],"data": ["weather", "weather"],"weather": [2023, 2033]};
        AIagentData: AIagent.Agent.IAIAgentData;
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
                    None: IntentObject.Intent_None,
                    QueryWeather: IntentObject.Intent_Weather,
                    Shopping: IntentObject.Intent_Shopping,
                };
        }


        //根据配置递归执行行为
        private executeIntent(IntentObject: IIntent, executeStepName: string, callback: (SpeechCode: number, SpeechPa: Object) => void)
        {
           if ("enter" == executeStepName) {
               this.executeIntent(IntentObject, IntentObject.execute["enter"], callback);
           }
           else
           {
               if (IntentObject.entities.hasOwnProperty(executeStepName)) {
                   (IntentObject.entities[executeStepName] as IEntity.Entity.IEntity).execute(null, (ActionRes: Action.Action.IActionRes) => {
                       if (ActionRes.res) {
                           if (typeof IntentObject.execute[executeStepName][0] == "number") {
                               this.OnExecuteIntentFinish(IntentObject);
                               callback(IntentObject.execute[executeStepName][0], ActionRes);
                           }
                           else {
                               this.executeIntent(IntentObject, IntentObject.execute[executeStepName][0], callback);
                           }

                       }
                       else {
                           if (typeof IntentObject.execute[executeStepName][1] == "number") {
                               this.OnExecuteIntentFinish(IntentObject);
                               callback(IntentObject.execute[executeStepName][1], ActionRes);
                           }
                           else {
                               this.executeIntent(IntentObject, IntentObject.execute[executeStepName][1], callback);
                           }
                       }
                   });
               }
               else if (IntentObject.actions.hasOwnProperty(executeStepName))
               {
                   var actionReq_: Action.Action.IActionReq = { AIAgentData: IntentObject.AIagentData, entity: IntentObject.entities };
                   (IntentObject.actions[executeStepName] as Action.Action.IAction).execute(actionReq_, (ActionRes: Action.Action.IActionRes) => {
                       if (ActionRes.res) {
                           if (typeof IntentObject.execute[executeStepName][0] == "number") {
                               this.OnExecuteIntentFinish(IntentObject);
                               callback(IntentObject.execute[executeStepName][0], ActionRes);
                           }
                           else {
                               this.executeIntent(IntentObject, IntentObject.execute[executeStepName][0], callback);
                           }

                       }
                       else {
                           if (typeof IntentObject.execute[executeStepName][1] == "number") {
                               this.OnExecuteIntentFinish(IntentObject);
                               callback(IntentObject.execute[executeStepName][1], ActionRes);
                           }
                           else {
                               this.executeIntent(IntentObject, IntentObject.execute[executeStepName][1], callback);
                           }
                       }
                   });
               }
               else
               {
                   callback(-1,null)
               }
           }
        }

        //当意图执行完毕时调用
        private OnExecuteIntentFinish(IntentObject: IIntent)
        {
            this.SaveUserIntentToRedis(IntentObject);
        }

        //Intent None;
       //private None(intentObject: LUISMainIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): string {
       //    console.log("IntentMgr log : Execute Intent None ");
       //    return "Execute Intent None "
       //}

        //Intent QueryWeather;
        //private QueryWeather(intentObject: LUISMainIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): string {
        //    var Intent_Weather_: IIntent = new Intent_Weather.Intent_Weather();
        //    for (var key in Intent_Weather_.entities)
        //    {
        //        (Intent_Weather_.entities[key] as IEntity.Entity.IEntity).query(intentObject.query, intentObject.entities);
        //    }
        //    this.executeIntent(Intent_Weather_, "enter",callback)
        //    return "";
        //}

        //Intent Invalid;
       // private Invalid(intentObject: LUISMainIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): string {
       //     console.log("IntentMgr log : Execute Intent Invalid ");
       //     return "Execute Intent None "
       // }

        //Intent ControlDevice;
        //private ControlDevice(intentObject: LUISMainIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): string {
        //    console.log("IntentMgr log : Execute Intent ControlDevice ");
        //    return "Execute Intent ControlDevice "
        //}


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

    //执行LUIS过来的意图
        public ExecuteLUISIntent(intent: string, _AIagentData: AIagent.Agent.IAIAgentData, intentObject: LUISMainIntent,callback: (SpeechCode: number, SpeechPa: Object) => void)
        {
            this.ReadIntent(_AIagentData, intentObject, (Intent: IIntent) => {
                for (var key in Intent.entities) {
                    (Intent.entities[key] as IEntity.Entity.IEntity).query(intentObject.query, intentObject.entities);
                }
                this.executeIntent(Intent, "enter", callback)
                return "";
            });
            //if (!this.IntentDict.hasOwnProperty(intent))
            //{
            //    console.log("IntentMgr error : " + intent +" Non-existent ");
            //    return;
            //}
            //var Intent: IIntent = new this.IntentDict[intent]();
            //Intent.AIagentData = _AIagentData;
        }
        //执行手动创建的意图
        public ExecuteIntent(intent: IIntent, callback: (SpeechCode: number, SpeechPa: Object) => void): void 
        {
            this.executeIntent(intent, "enter", callback)
        }


        //将用户意图存入数据库
        public SaveUserIntentToRedis(IntentObject: IIntent)
        {

            var IntentJson: Object = {};
            for (var key in IntentObject.entities)
            {
                if ((IntentObject.entities[key] as IEntity.Entity.IEntity).entity.length > 0)
                {
                    IntentJson[(IntentObject.entities[key] as IEntity.Entity.IEntity).name] = (IntentObject.entities[key] as IEntity.Entity.IEntity).entity;
                }
            }
            var redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
            redis.SetItemToHash(IntentObject.AIagentData.familyID, IntentObject.name(),JSON.stringify(IntentJson), (err, res) => {
                if (err) {
                    console.log(err);
                    redis.Quit();
                }
                else
                {
                    if (parseInt(res)> 5)
                   {
                       //redis.DeleteLastItemFromList(IntentObject.AIagentData.familyID, (err, res) => { redis.Quit(); });
                   }
                }        
           },60);
        }

        //将AI意图存入数据库
        public SaveAIIntentToRedis(IntentObject: IIntent) {
            var IntentJson: Object = {};
            for (var key in IntentObject.entities) {
                if ((IntentObject.entities[key] as IEntity.Entity.IEntity).entity.length > 0) {
                    IntentJson[(IntentObject.entities[key] as IEntity.Entity.IEntity).name] = (IntentObject.entities[key] as IEntity.Entity.IEntity).entity;
                }
            }
            var redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
            redis.SetItemToHash(IntentObject.AIagentData.familyID, IntentObject.name(), JSON.stringify(IntentJson), (err, res) => {
                if (err) {
                    console.log(err);
                    redis.Quit();
                }
                else {
                   //if ((res as number) > 5) {
                   //    redis.DeleteLastItemFromList(IntentObject.AIagentData.familyID, (err, res) => { redis.Quit(); });
                   //}
                }
            },600);
        }

        //读取 意图
        public ReadIntent(_AIagentData: AIagent.Agent.IAIAgentData, LUISIntentObject: LUISMainIntent, callback?: (Intent: IIntent) => void)
        {
            var redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
            redis.GetItemFromHash(_AIagentData.familyID, LUISIntentObject.name, (err, res) =>
            {
                if (err) {
                    console.log("ReadIntent err :"+err);
                    redis.Quit();

                }
                else
                {
                    console.log("ReadIntent res " + res);
                    if (res == null) {
                        if (!this.IntentDict.hasOwnProperty(LUISIntentObject.name)) {
                            console.log("IntentMgr error : " + LUISIntentObject.name + " Non-existent ");
                            return;
                        }
                        var Intent: IIntent = new this.IntentDict[LUISIntentObject.name]();
                        Intent.AIagentData = _AIagentData;
                        callback(Intent);
                    }
                    else
                    {
                        Intent=this.IntentJosnStringToObject(LUISIntentObject.name, res, _AIagentData)
                        callback(Intent);
                    }
                    redis.Quit();
                }

            });
        } 

        // IntentJosnString 数据库里意图的格式   stringToObject
        public IntentJosnStringToObject(IntentName: string, IntentJosnString: string, _AIagentData: AIagent.Agent.IAIAgentData): IIntent
        {
            var IntentJosnObject: Object = JSON.parse(IntentJosnString);
            var Intent: IIntent = new this.IntentDict[IntentName]();
            Intent.AIagentData = _AIagentData;
            for (var key in Intent.entities) {
                if (IntentJosnObject.hasOwnProperty(key)) {
                    (Intent.entities[key] as IEntity.Entity.IEntity).entity = IntentJosnObject[key];
                }
            }
            return Intent;
        }
    }
}


