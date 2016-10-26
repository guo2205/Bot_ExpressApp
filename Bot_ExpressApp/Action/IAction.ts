import Entity = require("../Entity/IEntity")
export namespace Action
 {
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
                 var res: Object = {
                     "res": true,
                     "TuLing":"我是图灵机器人，不过我还没在线！" 
                 };
             callback(res as IActionRes);
             return;
         }
     }

//========================================================================================================================
//  IAction
//========================================================================================================================

    export interface IAction{
        execute(actionReq:IActionReq, callback: (ActionRes: IActionRes) => void);
    }

    export class IActionReq {
        entity: Object;
    }

    export class IActionRes {
        res: boolean;
    }
}