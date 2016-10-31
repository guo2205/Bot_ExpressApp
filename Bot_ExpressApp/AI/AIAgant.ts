///<reference path="../Intent/Iintent.ts" />
import http = require("http");
import https = require("https");
import Iintent = require("../Intent/Iintent");
import Intent = require("../Intent/Intent");
import redisHelper = require("../DBH/RedisHelper");
import enumclass = require("../Enum");
import speechConfig = require("./SpeechConfig");
import Entity = require("../Entity/IEntity");

import * as db from "../conf/db";
import * as dao from "../dao/UtilsDao";

export module Agent
{
    export interface IAIAgentData
    {
        //ID  机器人唯一的标识 一个家庭一个
        familyID: number;
        //CID 角色对应的ID
        CID: number; 
        //设备的cdk
        CDK: string;
        //情绪的等级
        EmotionLV: number;
        //当前语句
        query: string;
        //客户端请求时间
        time: string;
    }

    export class AIAgent {
        private AEntityConfig: Object=
        {
                city: Entity.Entity.Entity_City,
                Data: Entity.Entity.Entity_Data,
        };

        private AIntentConfig =
        {
            QueryWeather: Intent.Intent_Weather,
            None: Intent.Intent_None,
        }



        private AIAgentData: IAIAgentData = { familyID: 0, CID: 0, CDK: "", EmotionLV: 3, query: "",time:"" };

        private intentMgr: Iintent.Intent.IntentMgr;

        constructor(_deviceCDK: string, _familyID: number)
        {
            this.AIAgentData.familyID = _familyID;
            this.AIAgentData.CID = 101;
            this.AIAgentData.CDK = _deviceCDK;
            this.AIAgentData.EmotionLV = 3;
            this.intentMgr = new Iintent.Intent.IntentMgr();
        }
        //_type 是接到传感器的类型 _id 是传感器的id
        public GetSenorTouch(_type: string, _id:string): void
        {

        }

        //_text 是接到的文本
        public GetTextTouch(_text: string): string {
            this.AIAgentData.query = _text;
            this.ContextUnderstanding(_text, (res: boolean) =>
            {
                this.GetLUISData(_text, (LUISData: string) => { this.GetLUISIntent(LUISData) });
            });
            return;
        }

    //=========================================================
    // LUIS处理流程
    //=========================================================

        //上传LUIS获得主意图 _text 是文本
        //https://api.projectoxford.ai/luis/v1/application?id=2646f289-febf-4892-9bf3-382bd84d6af6&subscription-key=177134f2b924409697183f32d513055a&q=%E6%89%93%E5%BC%80%E7%A9%BA%E8%B0%83
        private GetLUISData(_text: string, callback: (LUISData:string) => void): void
        {
            console.log("Agent log " + encodeURI(_text));
            var req: http.ClientRequest = https.get("https://api.projectoxford.ai/luis/v1/application?id=2646f289-febf-4892-9bf3-382bd84d6af6&subscription-key=177134f2b924409697183f32d513055a&q=" + encodeURI(_text), (res: http.ClientResponse) => {
                 res.setEncoding('utf8');
                 res.on('data', function (data) {
                     callback(data);
                 });
            });
            req.on('error', (e) => {
                console.log("Agent error "+ e.message);
            });
        }

        //解析LUIS数据
        private GetLUISIntent(LUISJosn: string): void
        {
            var MainIntent: Iintent.Intent.LUISMainIntent = this.intentMgr.CheckMainIntent(LUISJosn);
            console.log("MainIntent : " + MainIntent.name);
            this.intentMgr.ExecuteLUISIntent(MainIntent.name, this.AIAgentData, MainIntent,(SpeechCode: number, SpeechPa: Object) => { this.OnIntentCompleted(SpeechCode, SpeechPa); });
            return;
        }

        //Intent执行完成后
        private OnIntentCompleted(SpeechCode: number, SpeechPa: Object)
        {
            console.log(SpeechCode);
            console.log(SpeechPa);
            if (speechConfig.SpeechConfig.hasOwnProperty(SpeechCode.toString()))
            {
                var AIIntent = speechConfig.SpeechConfig[SpeechCode.toString()];
                var redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
                redis.SetItemToHash(this.AIAgentData.familyID, "AI_" + AIIntent["Intent"], JSON.stringify(AIIntent), (err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                    }
                    redis.Quit();
                },60);
            }
            var userdao: dao.utilDao = new dao.utilDao();
            var para = new db.param();
            para.tableName = 'ManSpeechModel';
            para.whereField = [{ key: 'SpeechCode', value: SpeechCode }];
            userdao.select(para, (obj: db.result) => {
                var testText: string = obj.info[0].SpeechModel;
                var strArray: string[] = this.getSubstr(testText);
                for (var o in strArray) {
                    testText = testText.replace('{' + strArray[o] + '}', SpeechPa[strArray[o]]);
                }
                var redis = new redisHelper.Redis(enumclass.RedisCollection.UserGetMessage);
                console.log(testText);
                var Item: Object = { Module: 10000, instruct: { txt: testText }, source: "server", time: this.AIAgentData.time, isTime: true };

                redis.SetItemToList(this.AIAgentData.CDK, JSON.stringify(Item), (err, res) => {
                    redis.Quit();
                });
            });
        }

        private getSubstr(str: string, strs = '{', stre = '}'): string[] {
            var mstr: string = '';
            var flg: boolean = false;
            var array: string[] = [];
            for (var i = 0; i < str.length; i++) {
                if (str[i] == strs) {
                    flg = true;
                    mstr = '';
                    continue;
                }
                if (str[i] == stre) {
                    flg = false;
                    array.push(mstr);
                }
                if (flg) {
                    mstr += str[i];
                }
            }
            return array;
        }


    //=========================================================
    // 上下文处理流程
    //=========================================================

        private ContextUnderstanding(text: string, callback: (res: boolean) => void): void {
            var redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
            redis.GetAllItemFromHash(this.AIAgentData.familyID, (err, res: Object) => {
                if (err) {
                    console.log("ContextUnderstanding err :" + err);
                    redis.Quit();
                    return;

                }
                else {
                    var Intentstring: string = null;
                    var entitystring: string = null;
                    var entityObject: Entity.Entity.IEntity = null;
                    var IntentObject: Iintent.Intent.IIntent = null;
                    var AIIntent: Iintent.Intent.IAIIntent = null;
                    for (var key in res) {
                        if (0 == key.indexOf("AI")) {
                            AIIntent=JSON.parse(res[key]) as Iintent.Intent.IAIIntent;
                            entitystring = AIIntent.entity;
                            entityObject = Entity.Entity.CreatEntityObject(entitystring);
                            entityObject.quest(text);
                            if (entityObject.entity.length > 0) {
                                //IntentObject = new this.AIntentConfig[AIIntent.Intent]();
                                IntentObject = this.intentMgr.IntentJosnStringToObject(AIIntent.Intent, res[AIIntent.Intent], this.AIAgentData);    
                                IntentObject.entities[AIIntent.entity] = entityObject;
                                this.intentMgr.ExecuteIntent(IntentObject, (SpeechCode: number, SpeechPa: Object) => { this.OnIntentCompleted(SpeechCode, SpeechPa); });
                                redis.Quit();
                                return;
                            }
                        }     
                    }
                    callback(true);
                    redis.Quit();
                    return;
                }
            });
        }
    }
}