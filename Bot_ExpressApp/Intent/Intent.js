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
var Intent_Shopping = (function () {
    function Intent_Shopping() {
        this.entities = { goodtype: new Entity.Entity.Entity_goodtype(), ensure: new Entity.Entity.Entity_ensure(), list: new Entity.Entity.Entity_list(), good: new Entity.Entity.Entity_good(), goodtag: new Entity.Entity.Entity_goodtag() };
        this.actions = { RecommendGood: new Action.Action.action_RecommendGood(), OrderGood: new Action.Action.action_OrderGood() };
        this.execute = {
            "enter": "list",
            "list": ["OrderGood", "goodtype"],
            "goodtype": ["goodtag", 10003],
            "goodtag": ["RecommendGood", "RecommendGood"],
            "RecommendGood": [10033, 10043],
            "OrderGood": [10013, 10053],
        };
    }
    Intent_Shopping.prototype.name = function () {
        return "Shopping";
    };
    return Intent_Shopping;
}());
exports.Intent_Shopping = Intent_Shopping;
var Intent_ControlAppliance = (function () {
    function Intent_ControlAppliance() {
        this.entities = { AppliancePetName: new Entity.Entity.Entity_AppliancePetName(), ApplianceType: new Entity.Entity.Entity_ApplianceType(), ControlType: new Entity.Entity.Entity_ControlType(), Location: new Entity.Entity.Entity_BuiltinNumber() };
        this.actions = { ControlAppliance: new Action.Action.action_ControlAppiance() };
        this.execute = {};
    }
    Intent_ControlAppliance.prototype.name = function () {
        return "ControlAppliance";
    };
    ;
    return Intent_ControlAppliance;
}());
exports.Intent_ControlAppliance = Intent_ControlAppliance;
//# sourceMappingURL=Intent.js.map