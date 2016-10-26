import IAction = require("../Action/IAction");

export namespace Entity
{
//========================================================================================================================
//  Entitys
//========================================================================================================================

    export class Entity_City implements IEntity {

        name: string = "city";

        entity: string[] = [];

        dictory: Object;

        query(queryString) {
           CommonQuery(this, queryString);
        }

        execute(actionReq: IAction.Action.IActionReq, callback: (ActionRes: IAction.Action.IActionRes) => void) {
            var result: IAction.Action.IActionRes = { "res": false };
            if (this.entity.length > 0) {
                result.res = true;
            }
            callback(result);
        }

        constructor() {
            this.dictory =
                {
                    北京: "北京",
                    上海: "上海"
                };
        }
    }

    export class Entity_Data implements IEntity {

        name: string = "Data";

        entity: string[] = [];

        dictory: Object;

        query(queryString) {
            CommonQuery(this, queryString);
        }

        execute(actionReq: IAction.Action.IActionReq, callback: (ActionRes: IAction.Action.IActionRes) => void) {
            var result: IAction.Action.IActionRes = { "res": false };
            if (this.entity.length > 0) {
                result.res = true;
            }
            callback(result);
        }

        constructor() {
            this.dictory =
                {
                    昨天: "昨天",
                    今天: "今天",
                    明天: "明天",
                    后天: "后天"
                };
        }
    }

//========================================================================================================================
//  IEntity
//========================================================================================================================
    export interface IEntity {
        name: string;

        entity: string[];

        //实体的目录
        dictory: Object;

        //实体的查询
        query(queryString: string, args);
        //boolean 执行结果 ！！！！！！！必须要继承实现 actionReq为null ActionRes的res填写结果
        execute(actionReq: IAction.Action.IActionReq, callback: (ActionRes: IAction.Action.IActionRes) => void);
    }

    function CommonQuery(Entity:IEntity,queryString) {
        var _entity = Array<string>();
        for (var key in Entity.dictory) {
            if (queryString.indexOf(key) > -1) {
                _entity.push(Entity.dictory[key]);
            }
        }
        if (_entity.length > 0) {
            Entity.entity = _entity;
        }
    }
}

