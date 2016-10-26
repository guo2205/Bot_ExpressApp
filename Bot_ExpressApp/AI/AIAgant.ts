///<reference path="../Intent/Iintent.ts" />
import http = require("http");
import https = require("https");
import Intent = require("../Intent/Iintent");
import redisHelper = require("../DBH/RedisHelper");
import enumclass = require("../Enum");
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
    }

    export class AIAgent {

        private AIAgentData: IAIAgentData = { familyID: 0, CID: 0, CDK: "", EmotionLV: 3 };

        private intentMgr: Intent.Intent.IntentMgr;

        constructor(_deviceCDK: string, _familyID: number)
        {
            this.AIAgentData.familyID = _familyID;
            this.AIAgentData.CID = 101;
            this.AIAgentData.CDK = _deviceCDK;
            this.AIAgentData.EmotionLV = 3;
            this.intentMgr=new Intent.Intent.IntentMgr();
        }
        //_type 是接到传感器的类型 _id 是传感器的id
        public GetSenorTouch(_type: string, _id:string): void
        {

        }

        //_text 是接到的文本
        public GetTextTouch(_text: string): string {
            this.GetLUISData(_text, (LUISData: string) => { this.GetLUISIntent(LUISData) });
            return;
        }

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
            var MainIntent: Intent.Intent.LUISMainIntent = this.intentMgr.CheckMainIntent(LUISJosn);
            console.log("MainIntent : " + MainIntent.name);
            this.intentMgr.ExecuteIntent(MainIntent.name, this.AIAgentData, MainIntent,(SpeechCode: number, SpeechPa: Object) => { this.OnIntentCompleted(SpeechCode, SpeechPa); });
            return;
        }


        private OnIntentCompleted(SpeechCode: number, SpeechPa: Object) {
            //console.log(SpeechCode);
            //console.log(SpeechPa);
            var userdao: dao.utilDao = new dao.utilDao();
            var para = new db.param();
            para.tableName = 'ManSpeechModel';
            para.whereField = [{ key: 'SpeechCode', value: SpeechCode }];
            userdao.select(para, (obj: db.result) => {
                console.log(JSON.stringify(obj.info));
                var testText: string = obj.info[0].SpeechModel;
                var strArray: string[] = this.getSubstr(testText);
                for (var o in strArray) {
                    testText = testText.replace('{' + strArray[o] + '}', SpeechPa[strArray[o]]);
                }
                var redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
                redis.SetItemToList(this.AIAgentData.CDK, '{"co":10000,"txt":["' + testText + '"]}', (err, res) => {
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




    }
}