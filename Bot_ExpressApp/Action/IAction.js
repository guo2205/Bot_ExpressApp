"use strict";
var Action;
(function (Action) {
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
            var res = {
                "res": true,
                "TuLing": "我是图灵机器人，不过我还没在线！"
            };
            callback(res);
            return;
        };
        return action_Chat;
    }());
    Action.action_Chat = action_Chat;
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