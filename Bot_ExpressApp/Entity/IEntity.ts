import IAction = require("../Action/IAction");


//存在问题 Entity的 dictory直接写在 类里面 后面需要修改
export namespace Entity
{

//========================================================================================================================
//  IEntity
//========================================================================================================================
    export interface IEntity {
        //实体名称
        name: string;

        tag: number;

        //实体的具体
        entity: string[];

        //实体的目录
        dictory: Object;

        //一般实体的查询
        query(queryString: string, args);

        //AI请求的实体的查询
        quest(queryString: string)

        //boolean 执行结果 ！！！！！！！必须要继承实现 actionReq为null ActionRes的res填写结果
        execute(actionReq: IAction.Action.IActionReq, callback: (ActionRes: IAction.Action.IActionRes) => void);
    }

    // 一般查询的实体 结果会是多个
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

    // 一般查询的实体 结果只会是第一个
    function CommonQueryOnlyOne(Entity: IEntity, queryString) {
        var _entity = Array<string>();
        for (var key in Entity.dictory) {
            if (queryString.indexOf(key) > -1) {
                _entity.push(Entity.dictory[key]);
                break;
            }
        }
        if (_entity.length > 0) {
            Entity.entity = _entity;
        }
    }

    export interface IlistEntity
    {
        //被选择的项 （12345）
        choosedItem: number;
        choosedItemstr: string;
        chooseListItem();
    }

    export interface IboolEntity {
        choosedBool: boolean;
        chooseBoolItem();
    }

    class BaseEntity implements IEntity, IlistEntity, IboolEntity //基本的实体类
    {

//========================================================================================================================
//  基本方法
//========================================================================================================================
        name: string="";

        tag: number=1;

        //实体的具体
        entity: string[]=[];

        //实体的目录
        dictory: Object;

        //一般实体的查询
        query(queryString: string, args)
        {
            CommonQuery(this, queryString);
        }

        //AI请求的实体的查询
        quest(queryString: string)
        {
            CommonQueryOnlyOne(this, queryString);
        }
        

        //boolean 执行结果 ！！！！！！！必须要继承实现 actionReq为null ActionRes的res填写结果
        execute(actionReq: IAction.Action.IActionReq, callback: (ActionRes: IAction.Action.IActionRes) => void)
        {
            var result: IAction.Action.IActionRes = { "res": false };
            if (this.entity.length > 0) {
                result.res = true;
            }
            callback(result);
        }

        constructor() {
        };

//========================================================================================================================
//  list实体拓展方法
//========================================================================================================================

        choosedItem: number;

        choosedItemstr: string;

        SetFucChooseListItem: () => void = null;

        chooseListItem()
        {
            if (null != this.chooseListItem) {
                this.chooseListItem();
            }
            else {
                console.log(this.name + "is not extend function chooseListItem");
            } 
        }

//========================================================================================================================
//  bool实体拓展方法
//========================================================================================================================
        choosedBool: boolean;

        SetFucBoolListItem: () => void = null;

        chooseBoolItem()
        {
            if (null != this.SetFucBoolListItem)
            {
                this.SetFucBoolListItem();
            }
            else
            {
                console.log(this.name +"is not extend function chooseBoolItem");
            } 
        }


    }

    export function CreatEntityObject(EntityName: string): IEntity {
        var EntityConfig_ = {
            city: Entity_City,
            Data: Entity_Data,
            goodtype: Entity_goodtype,
            choosegood: Entity_choosegood,
            list: Entity_list,
            good: Entity_good,
        };
        var EntityObject: IEntity = new EntityConfig_[EntityName]();
        return EntityObject;
    }
    //========================================================================================================================
    //  Entitys 简单关键字实体
    //========================================================================================================================

    //城市
    export class Entity_City extends BaseEntity {

        name: string = "city";

        tag: number = 0;

        constructor() {
            super();
            this.dictory =
                {
                    上海: "上海",
                    北京: "北京",
                }
        }
    }

    //商品类型
    export class Entity_goodtype extends BaseEntity {

        name: string = "goodtype";

        tag: number = 0;

        constructor() {
            super();
            this.dictory =
                {
                    牛奶: "牛奶",
                    鸡蛋: "鸡蛋",
                    苹果: "苹果",
                };
        }
    }

    //相对时间 （昨天 今天 明天 后天）
    export class Entity_Data extends BaseEntity {

        name: string = "Data";

        tag: number = 0;

        constructor() {
            super();
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
    //  Entitys 类bool实体
    //========================================================================================================================
    export class Entity_choosegood extends BaseEntity {
        name: string = "choosegood";

        tag: number = 1;

        constructor() {
            super();
            this.dictory =
                {
                    换: "换",
                    不好: "是",
                    不要: "不是",
                    不可以: "不是",
                    可以: "是",
                    好的: "是",
                    要: "是",
                };
        }
    }

    //========================================================================================================================
    //  Entitys 列表实体
    //========================================================================================================================

    export class Entity_list extends BaseEntity {

        name: string = "list";

        tag: number = 1;

        query(queryString, args) {
            console.log("Entity_list query function");
        }
         
        constructor() {
            super();
            this.dictory =
                {
                    "换": "换",
                    "不要": "换",
                    1: "1",
                    2: "2",
                    3: "3",
                    一: "1",
                    二: "2",
                    三: "3",
                };
        }
    }


    //========================================================================================================================
    //  Entitys 被动实体无法用户主动说明
    //========================================================================================================================
    //商品
    export class Entity_good extends BaseEntity {

        name: string = "good";

        tag: number = 0;

        execute(actionReq: IAction.Action.IActionReq, callback: (ActionRes: IAction.Action.IActionRes) => void) {
            var result: IAction.Action.IActionRes = { "res": false };
            if (this.entity.length > 0) {
                result.res = true;
            }
            callback(result);
        }

        constructor() {
            super();
        }
    }

}

