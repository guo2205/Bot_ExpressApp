"use strict";
var IntentObject = require("./Intent");
var redisHelper = require("../DBH/RedisHelper");
var enumclass = require("../Enum");
var Intent;
(function (Intent_1) {
    var IntentMgr = (function () {
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
        function IntentMgr() {
            this.BindIntent();
        }
        //=========================================================
        // IntentMgr  private 
        //=========================================================
        IntentMgr.prototype.BindIntent = function () {
            this.IntentDict =
                {
                    None: IntentObject.Intent_None,
                    QueryWeather: IntentObject.Intent_Weather,
                };
        };
        //根据配置递归执行行为
        IntentMgr.prototype.executeIntent = function (IntentObject, executeStepName, callback) {
            var _this = this;
            if ("enter" == executeStepName) {
                this.executeIntent(IntentObject, IntentObject.execute["enter"], callback);
            }
            else {
                if (IntentObject.entities.hasOwnProperty(executeStepName)) {
                    IntentObject.entities[executeStepName].execute(null, function (ActionRes) {
                        if (ActionRes.res) {
                            if (typeof IntentObject.execute[executeStepName][0] == "number") {
                                _this.OnExecuteIntentFinish(IntentObject);
                                callback(IntentObject.execute[executeStepName][0], ActionRes);
                            }
                            else {
                                _this.executeIntent(IntentObject, IntentObject.execute[executeStepName][0], callback);
                            }
                        }
                        else {
                            if (typeof IntentObject.execute[executeStepName][1] == "number") {
                                _this.OnExecuteIntentFinish(IntentObject);
                                callback(IntentObject.execute[executeStepName][1], ActionRes);
                            }
                            else {
                                _this.executeIntent(IntentObject, IntentObject.execute[executeStepName][1], callback);
                            }
                        }
                    });
                }
                else if (IntentObject.actions.hasOwnProperty(executeStepName)) {
                    var actionReq_ = { entity: IntentObject.entities };
                    IntentObject.actions[executeStepName].execute(actionReq_, function (ActionRes) {
                        if (ActionRes.res) {
                            if (typeof IntentObject.execute[executeStepName][0] == "number") {
                                _this.OnExecuteIntentFinish(IntentObject);
                                callback(IntentObject.execute[executeStepName][0], ActionRes);
                            }
                            else {
                                _this.executeIntent(IntentObject, IntentObject.execute[executeStepName][0], callback);
                            }
                        }
                        else {
                            if (typeof IntentObject.execute[executeStepName][1] == "number") {
                                _this.OnExecuteIntentFinish(IntentObject);
                                callback(IntentObject.execute[executeStepName][1], ActionRes);
                            }
                            else {
                                _this.executeIntent(IntentObject, IntentObject.execute[executeStepName][1], callback);
                            }
                        }
                    });
                }
                else {
                    callback(-1, null);
                }
            }
        };
        //当意图执行完毕时调用
        IntentMgr.prototype.OnExecuteIntentFinish = function (IntentObject) {
            this.SaveIntentToRedis(IntentObject);
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
        //执行LUIS过来的意图
        IntentMgr.prototype.ExecuteIntent = function (intent, _AIagentData, intentObject, callback) {
            var _this = this;
            this.ReadIntent(_AIagentData, intentObject, function (Intent) {
                for (var key in Intent.entities) {
                    Intent.entities[key].query(intentObject.query, intentObject.entities);
                }
                _this.executeIntent(Intent, "enter", callback);
                return "";
            });
            //if (!this.IntentDict.hasOwnProperty(intent))
            //{
            //    console.log("IntentMgr error : " + intent +" Non-existent ");
            //    return;
            //}
            //var Intent: IIntent = new this.IntentDict[intent]();
            //Intent.AIagentData = _AIagentData;
        };
        //将意图存入数据库
        IntentMgr.prototype.SaveIntentToRedis = function (IntentObject) {
            var IntentJson = {};
            for (var key in IntentObject.entities) {
                if (IntentObject.entities[key].entity.length > 0) {
                    IntentJson[IntentObject.entities[key].name] = IntentObject.entities[key].entity;
                }
            }
            var redis = new redisHelper.Redis(enumclass.RedisCollection.MicrosoftLUIS);
            redis.SetItemToHash(IntentObject.AIagentData.ID, IntentObject.name(), JSON.stringify(IntentJson), function (err, res) {
                if (err) {
                    console.log(err);
                    redis.Quit();
                }
                else {
                    if (res > 5) {
                        redis.DeleteLastItemFromList(IntentObject.AIagentData.ID, function (err, res) { redis.Quit(); });
                    }
                }
            });
        };
        IntentMgr.prototype.ReadIntent = function (_AIagentData, LUISIntentObject, callback) {
            var _this = this;
            var redis = new redisHelper.Redis(enumclass.RedisCollection.MicrosoftLUIS);
            redis.GetItemFromHash(_AIagentData.ID, LUISIntentObject.name, function (err, res) {
                if (err) {
                    console.log("ReadIntent err :" + err);
                    redis.Quit();
                }
                else {
                    console.log("ReadIntent res " + res);
                    if (res == null) {
                        if (!_this.IntentDict.hasOwnProperty(LUISIntentObject.name)) {
                            console.log("IntentMgr error : " + LUISIntentObject.name + " Non-existent ");
                            return;
                        }
                        var Intent = new _this.IntentDict[LUISIntentObject.name]();
                        Intent.AIagentData = _AIagentData;
                        callback(Intent);
                    }
                    else {
                        var IntentJosnObject = JSON.parse(res);
                        var Intent = new _this.IntentDict[LUISIntentObject.name]();
                        Intent.AIagentData = _AIagentData;
                        for (var key in Intent.entities) {
                            if (IntentJosnObject.hasOwnProperty(key)) {
                                Intent.entities[key].entity = IntentJosnObject[key];
                            }
                        }
                        callback(Intent);
                    }
                    redis.Quit();
                }
            });
        };
        return IntentMgr;
    }());
    Intent_1.IntentMgr = IntentMgr;
})(Intent = exports.Intent || (exports.Intent = {}));
//# sourceMappingURL=Iintent.js.map