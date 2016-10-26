"use strict";
var Entity = require("../Entity/IEntity");
var Action = require("../Action/IAction");
var Intent_Weather = (function () {
    function Intent_Weather() {
        this.entities = { "city": new Entity.Entity.Entity_City(), "data": new Entity.Entity.Entity_Data() };
        this.actions = { "weather": new Action.Action.action_Weather() };
        this.execute = {
            "enter": "city",
            "city": ["data", 2003],
            "data": ["weather", "weather"],
            "weather": [2023, 2033]
        };
    }
    Intent_Weather.prototype.name = function () {
        return "QueryWeather";
    };
    return Intent_Weather;
}());
exports.Intent_Weather = Intent_Weather;
var Intent_None = (function () {
    function Intent_None() {
        this.entities = {};
        this.actions = { "none": new Action.Action.action_Chat() };
        this.execute = {
            "enter": "none",
            "none": [1003, 5003]
        };
    }
    Intent_None.prototype.name = function () {
        return "None";
    };
    return Intent_None;
}());
exports.Intent_None = Intent_None;
//# sourceMappingURL=Intent.js.map