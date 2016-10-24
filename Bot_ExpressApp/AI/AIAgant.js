"use strict";
var https = require("https");
var Intent = require("../Intent/Iintent");
var redisHelper = require("../DBH/RedisHelper");
var enumclass = require("../Enum");
var Agent;
(function (Agent) {
    var AIAgent = (function () {
        function AIAgent(_ID, _CDK) {
            this.AIAgentData = { ID: 0, CID: 0, CDK: "", EmotionLV: 3 };
            this.AIAgentData.ID = _ID;
            this.AIAgentData.CID = 101;
            this.AIAgentData.CDK = _CDK;
            this.AIAgentData.EmotionLV = 3;
            this.intentMgr = new Intent.Intent.IntentMgr();
        }
        //_type 是接到传感器的类型 _id 是传感器的id
        AIAgent.prototype.GetSenorTouch = function (_type, _id) {
        };
        //_text 是接到的文本
        AIAgent.prototype.GetTextTouch = function (_text) {
            var _this = this;
            this.GetLUISData(_text, function (LUISData) { _this.GetLUISIntent(LUISData); });
            return;
        };
        //上传LUIS获得主意图 _text 是文本
        //https://api.projectoxford.ai/luis/v1/application?id=2646f289-febf-4892-9bf3-382bd84d6af6&subscription-key=177134f2b924409697183f32d513055a&q=%E6%89%93%E5%BC%80%E7%A9%BA%E8%B0%83
        AIAgent.prototype.GetLUISData = function (_text, callback) {
            console.log("Agent log " + encodeURI(_text));
            var req = https.get("https://api.projectoxford.ai/luis/v1/application?id=2646f289-febf-4892-9bf3-382bd84d6af6&subscription-key=177134f2b924409697183f32d513055a&q=" + encodeURI(_text), function (res) {
                res.setEncoding('utf8');
                res.on('data', function (data) {
                    callback(data);
                });
            });
            req.on('error', function (e) {
                console.log("Agent error " + e.message);
            });
        };
        //解析LUIS数据
        AIAgent.prototype.GetLUISIntent = function (LUISJosn) {
            var _this = this;
            var MainIntent = this.intentMgr.CheckMainIntent(LUISJosn);
            console.log("MainIntent : " + MainIntent.name);
            this.intentMgr.ExecuteIntent(MainIntent.name, this.AIAgentData, MainIntent, function (SpeechCode, SpeechPa) { _this.OnIntentCompleted(SpeechCode, SpeechPa); });
            return;
        };
        AIAgent.prototype.OnIntentCompleted = function (SpeechCode, SpeechPa) {
            //console.log(SpeechPa);
            var testText = '{city}的天气，最高温度是{t_max}度,最低温度是{t_min}度';
            var strArray = this.getSubstr(testText);
            for (var o in strArray) {
                testText = testText.replace('{' + strArray[o] + '}', SpeechPa[strArray[o]]);
            }
            var redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
            redis.SetItemToList("123123", '{"co":10000,"txt":["' + testText + '"]}', function (err, res) {
                console.log(res);
                redis.Quit();
            });
        };
        AIAgent.prototype.getSubstr = function (str, strs, stre) {
            if (strs === void 0) { strs = '{'; }
            if (stre === void 0) { stre = '}'; }
            var mstr = '';
            var flg = false;
            var array = [];
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
        };
        return AIAgent;
    }());
    Agent.AIAgent = AIAgent;
})(Agent = exports.Agent || (exports.Agent = {}));
//# sourceMappingURL=AIAgant.js.map