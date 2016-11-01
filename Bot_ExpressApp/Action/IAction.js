"use strict";
var data = require("../Data");
var Action;
(function (Action) {
    //========================================================================================================================
    //  function
    //========================================================================================================================
    function CreatActionObject(actionName) {
        var actionconfig = {
            "Weather": action_Weather,
            "Chat": action_Chat,
        };
        var actionObject = new actionconfig[actionName]();
        return actionObject;
    }
    Action.CreatActionObject = CreatActionObject;
    //========================================================================================================================
    //  Actions
    //========================================================================================================================
    var action_Weather = (function () {
        function action_Weather() {
        }
        action_Weather.prototype.execute = function (actionReq, callback) {
            try {
                var res = {
                    "res": false,
                    "city": actionReq.entity["city"].entity[0],
                    "t_code": 0,
                    "data": actionReq.entity["data"].entity[0],
                    "t_text": "晴",
                    "t_max": 27,
                    "t_min": 15
                };
            }
            catch (e) {
                var res = {
                    "res": false,
                    "city": "123",
                    "t_code": 0,
                    "data": "123",
                    "t_text": "晴",
                    "t_max": 27,
                    "t_min": 15
                };
            }
            callback(res);
            return;
        };
        return action_Weather;
    }());
    Action.action_Weather = action_Weather;
    var action_Chat = (function () {
        function action_Chat() {
        }
        action_Chat.prototype.execute = function (actionReq, callback) {
            var key = "ccbb9b948dbd40aa92fcdca79410f3fc";
            var info = actionReq.AIAgentData.query;
            var userid = actionReq.AIAgentData.familyID;
            var bady = { key: key, info: info, userid: userid };
            var headers = { ContentType: "application/json" };
            data.Data.httpRequest("www.tuling123.com", "/openapi/api", 80, "POST", headers, bady, function (message) {
                var json = JSON.parse(message);
                var res = {
                    res: true,
                    tulingText: json.text
                };
                callback(res);
            });
            return;
        };
        return action_Chat;
    }());
    Action.action_Chat = action_Chat;
    var action_RecommendGood = (function () {
        function action_RecommendGood() {
        }
        action_RecommendGood.prototype.execute = function (actionReq, callback) {
            if (actionReq.entity["goodtag"].entity[0] == "便宜") {
                if (actionReq.entity["goodtype"].entity[0] == "牛奶") {
                    var res = {
                        "res": true,
                        "good0": "光明特价牛奶 33元一箱6盒",
                        "good1": "蒙牛优惠牛奶 40元一箱12袋",
                        "good2": "伊利特价牛奶 50元一箱12瓶",
                    };
                }
                else if (actionReq.entity["goodtype"].entity[0] == "鸡蛋") {
                    var res = {
                        "res": true,
                        "good0": "德青源鲜鸡蛋8枚，12.9元",
                        "good1": "密园小农的柴鸡蛋10枚 29元",
                        "good2": "京东上的密园小农的柴鸡蛋5枚 9.9元",
                    };
                }
                else {
                    var res = {
                        "res": false,
                        goodtype: actionReq.entity["goodtype"].entity[0],
                    };
                    callback(res);
                    return;
                }
            }
            else {
                if (actionReq.entity["goodtype"].entity[0] == "牛奶") {
                    var res = {
                        "res": true,
                        "good0": "光明牛奶 38元一箱6盒",
                        "good1": "蒙牛牛奶 48元一箱12袋",
                        "good2": "伊利牛奶 58元一箱12瓶",
                    };
                }
                else if (actionReq.entity["goodtype"].entity[0] == "鸡蛋") {
                    var res = {
                        "res": true,
                        "good0": "德青源鲜鸡蛋16枚，24.9元",
                        "good1": "密园小农的柴鸡蛋20枚 49元",
                        "good2": "京东上的密园小农的柴鸡蛋10枚 19.9元",
                    };
                }
                else {
                    var res = {
                        "res": false,
                        goodtype: actionReq.entity["goodtype"].entity[0],
                    };
                    callback(res);
                    return;
                }
            }
            actionReq.entity["good"].entity[0] = res["good0"];
            actionReq.entity["good"].entity[1] = res["good1"];
            actionReq.entity["good"].entity[2] = res["good2"];
            callback(res);
            return;
        };
        return action_RecommendGood;
    }());
    Action.action_RecommendGood = action_RecommendGood;
    var action_OrderGood = (function () {
        function action_OrderGood() {
        }
        action_OrderGood.prototype.execute = function (actionReq, callback) {
            if (actionReq.entity["list"].entity[0] == "换") {
                var res = {
                    "res": false,
                };
            }
            else {
                var res = {
                    "res": true,
                    good: actionReq.entity["good"].entity[parseInt(actionReq.entity["list"].entity[0]) - 1],
                };
                actionReq.entity["good"].entity = [];
                actionReq.entity["goodtype"].entity = [];
                actionReq.entity["list"].entity = [];
            }
            callback(res);
            return;
        };
        return action_OrderGood;
    }());
    Action.action_OrderGood = action_OrderGood;
    var action_ControlAppiance = (function () {
        function action_ControlAppiance() {
        }
        action_ControlAppiance.prototype.execute = function (actionReq, callback) {
        };
        ;
        return action_ControlAppiance;
    }());
    Action.action_ControlAppiance = action_ControlAppiance;
    var IActionReq = (function () {
        function IActionReq() {
        }
        return IActionReq;
    }());
    Action.IActionReq = IActionReq;
    var IActionRes = (function () {
        function IActionRes() {
        }
        return IActionRes;
    }());
    Action.IActionRes = IActionRes;
})(Action = exports.Action || (exports.Action = {}));
//# sourceMappingURL=IAction.js.map