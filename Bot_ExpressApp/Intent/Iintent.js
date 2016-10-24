"use strict";
var Intent;
(function (Intent) {
    var IntentMgr = (function () {
        function IntentMgr() {
            this.BindIntent();
        }
        //=========================================================
        // IntentMgr  private 
        //=========================================================
        IntentMgr.prototype.BindIntent = function () {
            var _this = this;
            this.IntentDict =
                {
                    None: function (intentObject, OnFinish) { return _this.None(intentObject, OnFinish); },
                    QueryWeather: function (intentObject, OnFinish) { return _this.QueryWeather(intentObject, OnFinish); },
                    Invalid: function (intentObject, OnFinish) { return _this.Invalid(intentObject, OnFinish); },
                };
        };
        //Intent None;
        IntentMgr.prototype.None = function (intentObject, callback) {
            console.log("IntentMgr log : Execute Intent None ");
            return "Execute Intent None ";
        };
        //Intent QueryWeather;
        IntentMgr.prototype.QueryWeather = function (intentObject, callback) {
            console.log("IntentMgr log : Execute Intent QueryWeather " + intentObject);
            var SpeechPa_ = { "city": "上海", "t_max": 25, "t_min": 19 };
            callback(2023, SpeechPa_);
            return "Execute Intent None ";
        };
        //Intent QueryWeather;
        IntentMgr.prototype.Invalid = function (intentObject, callback) {
            console.log("IntentMgr log : Execute Intent Invalid ");
            return "Execute Intent None ";
        };
        IntentMgr.prototype.ControlDevice = function (intentObject, callback) {
            console.log("IntentMgr log : Execute Intent ControlDevice ");
            return "Execute Intent ControlDevice ";
        };
        //=========================================================
        // IntentMgr  public 
        //=========================================================
        IntentMgr.prototype.CheckMainIntent = function (LUISstring) {
            var MainIntent = "None";
            var Maxscore = 0;
            var LUISJson;
            var MainIntentObject;
            try {
                LUISJson = JSON.parse(LUISstring);
                for (var i = 0; i < LUISJson.intents.length; i++) {
                    if (LUISJson.intents[i].score > Maxscore) {
                        Maxscore = LUISJson.intents[i].score;
                        MainIntent = LUISJson.intents[i].intent;
                    }
                }
            }
            catch (e) {
                console.log("IntentMgr error : " + e.message);
                MainIntentObject =
                    {
                        name: "Invalid",
                        query: LUISJson.query,
                        entities: LUISJson.entities
                    };
                return MainIntentObject;
            }
            MainIntentObject =
                {
                    name: MainIntent,
                    query: LUISJson.query,
                    entities: LUISJson.entities
                };
            return MainIntentObject;
        };
        IntentMgr.prototype.ExecuteIntent = function (intent, AIagentData, intentObject, callback) {
            if (!this.IntentDict.hasOwnProperty(intent)) {
                console.log("IntentMgr error : " + intent + " Non-existent ");
                return;
            }
            return this.IntentDict[intent](intentObject, callback);
        };
        return IntentMgr;
    }());
    Intent.IntentMgr = IntentMgr;
})(Intent = exports.Intent || (exports.Intent = {}));
//# sourceMappingURL=Iintent.js.map