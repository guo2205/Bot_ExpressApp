import Entity = require("../Entity/IEntity");
import * as data from "../Data"; 
import AI = require("../AI/AIAgant");

export namespace Action
{

//========================================================================================================================
//  function
//========================================================================================================================
    export function CreatActionObject(actionName: string): IAction {
        var actionconfig = {
            "Weather": action_Weather,
            "Chat": action_Chat,
        };
        var actionObject: IAction = new actionconfig[actionName]();
        return actionObject;
    }
//========================================================================================================================
//  Actions
//========================================================================================================================
    export class action_Weather implements IAction {
        execute(actionReq: IActionReq, callback: (ActionRes: IActionRes) => void) {
            try {
                var res: Object = {
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
                var res: Object = {
                    "res": false,
                    "city": "123",
                    "t_code": 0,
                    "data": "123",
                    "t_text": "晴",
                    "t_max": 27,
                    "t_min": 15
                };
            }
            callback(res as IActionRes);
            return;
        }
    }

    export class action_Chat implements IAction {
        execute(actionReq: IActionReq, callback: (ActionRes: IActionRes) => void) {
            var key = "ccbb9b948dbd40aa92fcdca79410f3fc";
            var info = actionReq.AIAgentData.query;
            var userid = actionReq.AIAgentData.familyID;
            var bady = { key: key, info: info, userid: userid };
            var headers = { ContentType: "application/json" };
            data.Data.httpRequest("www.tuling123.com", "/openapi/api", 80, "POST", headers, bady, function (message) {
                var json = JSON.parse(message);
                var res: Object = {
                    res: true,
                    tulingText: json.text
                };
                callback(res as IActionRes);
            });
            return;
        }
    }

    export class action_RecommendGood implements IAction {
        execute(actionReq: IActionReq, callback: (ActionRes: IActionRes) => void) {
            if (actionReq.entity["goodtag"].entity[0] == "便宜") {
                if (actionReq.entity["goodtype"].entity[0] == "牛奶") {
                    var res: Object = {
                        "res": true,
                        "good0": "光明特价牛奶 33元一箱6盒",
                        "good1": "蒙牛优惠牛奶 40元一箱12袋",
                        "good2": "伊利特价牛奶 50元一箱12瓶",
                    };
                }
                else if (actionReq.entity["goodtype"].entity[0] == "鸡蛋") {
                    var res: Object = {
                        "res": true,
                        "good0": "德青源鲜鸡蛋8枚，12.9元",
                        "good1": "密园小农的柴鸡蛋10枚 29元",
                        "good2": "京东上的密园小农的柴鸡蛋5枚 9.9元",
                    };
                }
                else {
                    var res: Object = {
                        "res": false,
                        goodtype: actionReq.entity["goodtype"].entity[0],
                    };
                    callback(res as IActionRes);
                    return
                }
            }
            else
            {
                if (actionReq.entity["goodtype"].entity[0] == "牛奶") {
                    var res: Object = {
                        "res": true,
                        "good0": "光明牛奶 38元一箱6盒",
                        "good1": "蒙牛牛奶 48元一箱12袋",
                        "good2": "伊利牛奶 58元一箱12瓶",
                    };
                }
                else if (actionReq.entity["goodtype"].entity[0] == "鸡蛋") {
                    var res: Object = {
                        "res": true,
                        "good0": "德青源鲜鸡蛋16枚，24.9元",
                        "good1": "密园小农的柴鸡蛋20枚 49元",
                        "good2": "京东上的密园小农的柴鸡蛋10枚 19.9元",
                    };
                }
                else {
                    var res: Object = {
                        "res": false,
                        goodtype: actionReq.entity["goodtype"].entity[0],
                    };
                    callback(res as IActionRes);
                    return
                }
            }
             (actionReq.entity["good"] as Entity.Entity.IEntity).entity[0]=res["good0"];
             (actionReq.entity["good"] as Entity.Entity.IEntity).entity[1]=res["good1"];
             (actionReq.entity["good"] as Entity.Entity.IEntity).entity[2]=res["good2"];
             callback(res as IActionRes);
             return;
         }
     }

    export class action_OrderGood implements IAction {
         execute(actionReq: IActionReq, callback: (ActionRes: IActionRes) => void) {
             if (actionReq.entity["list"].entity[0] == "换") {
                 var res: Object = {
                     "res": false,
                 };
             }
             else
             {
                 var res: Object = {
                     "res": true,
                     good: (actionReq.entity["good"] as Entity.Entity.IEntity).entity[parseInt((actionReq.entity["list"] as Entity.Entity.IEntity).entity[0])-1],
                 };
                 actionReq.entity["good"].entity = [];
                 actionReq.entity["goodtype"].entity = [];
                 actionReq.entity["list"].entity = [];
             }
             callback(res as IActionRes);
             return;
         }
     }

     export class action_ControlAppiance implements IAction
     {
         execute(actionReq: IActionReq, callback: (ActionRes: IActionRes) => void)
         {
            
         };
     }
//========================================================================================================================
//  IAction
//========================================================================================================================

    export interface IAction{
        execute(actionReq:IActionReq, callback: (ActionRes: IActionRes) => void);
    }

    export class IActionReq {
        AIAgentData: AI.Agent.IAIAgentData;
        entity: Object;//{ "city": new Entity.Entity.Entity_City(), "data": new Entity.Entity.Entity_Data() }

    }

    export class IActionRes {
        res: boolean;
    }
}