﻿import Entity = require("../Entity/IEntity")
import Action = require("../Action/IAction")
import Iintent = require("./Iintent")
import AIagent = require("../AI/AIAgant");


export class Intent_Weather implements Iintent.Intent.IIntent
{
    public name(): string
    {
        return "QueryWeather";
    }

    public entities: Object = { "city": new Entity.Entity.Entity_City(), "data": new Entity.Entity.Entity_Data() };

    public actions: Object = { "weather": new Action.Action.action_Weather() };

    public  execute: Object = {
        "enter": "city",
        "city": ["data", 2003],
        "data": ["weather", "weather"],
        "weather": [2023, 2033]
    };

    public AIagentData: AIagent.Agent.IAIAgentData;

    constructor()
    {

    }
}

export class Intent_None implements Iintent.Intent.IIntent {
    public name(): string {
        return "None";
    }

    public entities: Object = {};

    public actions: Object = { "none": new Action.Action.action_Chat() };

    public execute: Object = {
        "enter": "none",
        "none": [1003, 5003]
    };

    public AIagentData: AIagent.Agent.IAIAgentData;

    constructor() {

    }
}