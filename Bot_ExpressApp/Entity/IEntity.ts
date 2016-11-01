import IAction = require("../Action/IAction");
import Iintent = require("../Intent/Iintent");

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
        query(queryString: string, args: Iintent.Intent.LUISEntityData[]);

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
        ListItem: string[];
        choosedItem: number;
        choosedItemstr: string;
        chooseListItem(queryString);
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
        query(queryString: string, args: Iintent.Intent.LUISEntityData[])
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
        ListItem: string[];

        choosedItem: number;

        choosedItemstr: string;

        SetFucChooseListItem: (queryString: string) => void = null;

        chooseListItem(queryString)
        {
            if (null != this.SetFucChooseListItem) {
                this.SetFucChooseListItem(queryString);
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
            ensure: Entity_ensure,
            list: Entity_list,
            good: Entity_good,
            goodtag:Entity_goodtag,
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
    //家电类型
    export class Entity_ApplianceType extends BaseEntity
    {
        name: string = "ApplianceType";

        tag: number = 0;

        constructor() {
            super();
            this.dictory =
                {
                    电视: "电视",
                    空调: "空调",
                };
        }
    }
    //家电控制方式
    export class Entity_ControlType extends BaseEntity
    {
        name: string = "ControlType";

        tag: number = 0;

        constructor() {
            super();
            this.dictory =
                {
                    打开: "开",
                    关闭: "关",
                };
        }
    }
    //家电昵称
    export class Entity_AppliancePetName extends BaseEntity
    {
        name: string = "AppliancePetName";

        tag: number = 0;

        constructor() {
            super();
            this.dictory =
                {
                    小电: "电视",
                    小空: "空调",
                };
        }
    }
    //数值（0 1 2 3）
    export class Entity_BuiltinNumber extends BaseEntity
    {
        name: string = "";

        tag: number = 0;

        //实体的具体
        entity: string[] = [];

        //一般实体的查询
        query(queryString: string, args: Iintent.Intent.LUISEntityData[]) {
            for (let num = 0; num < args.length; num++)
            {
                if (args[num].type == "builtin.number")
                    this.entity.push(args[num].entity);
            }
        }
    }
    //家庭区域
    export class Entity_Location extends BaseEntity
    {
        name: string = "Location";

        tag: number = 0;

        constructor() {
            super();
            this.dictory =
                {
                    客厅: "客厅",
                    卧室: "卧室",
                };
        }
    }

    //商品标签 便宜 换一批等

    export class Entity_goodtag extends BaseEntity {
        name: string = "goodtag";

        tag: number = 0;

        constructor() {
            super();
            this.dictory =
                {
                    便宜: "便宜",
                    有点贵: "便宜",
                    太贵: "便宜",
                    换: "换",
                };
        }
    }
    //========================================================================================================================
    //  Entitys 类bool实体
    //========================================================================================================================
    export class Entity_ensure extends BaseEntity {
        name: string = "_ensure";

        tag: number = 1;

        query(queryString, args) {
            console.log("Entity__ensure query function");
        }

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

        tag: number = 0;

        query(queryString, args) {
            console.log("Entity_list query function");
        }

        quest(queryString: string) {
            CommonQueryOnlyOne(this, queryString);
            if (this.entity.length > 0) {
                try {
                    this.choosedItem = parseInt(this.entity[0]);
                    this.choosedItemstr = this.ListItem[this.choosedItem];
                }
                catch (e)
                {
                    for (var key in this.ListItem) {
                        if (this.ListItem[key].indexOf(queryString) >= 0) {
                            this.entity = [key];
                            this.choosedItem = parseInt(key);
                            this.choosedItemstr = this.ListItem[this.choosedItem];
                            break;
                        }
                    }  
                }
            }
            else
            {
                console.log(0);
                for (var key in this.ListItem) {
                    if (this.ListItem[key].indexOf(queryString) >= 0) {
                        this.entity = [key];
                        this.choosedItem = parseInt(key);
                        this.choosedItemstr = this.ListItem[this.choosedItem];
                        break;
                    }
                }  
            } 
        }

        ListItem: string[]=[];

        choosedItem: number=-1;

        choosedItemstr: string="";

        SetFucChooseListItem: (queryString: string) => void = (queryString: string) => {
            console.log(0);
            for (var key in this.ListItem) {
                if (this.ListItem[key].indexOf(queryString) >= 0) {
                    this.entity = [key];
                    this.choosedItem = parseInt(key);
                    this.choosedItemstr = this.ListItem[this.choosedItem];
                    break;
                }
            }  
        };
         
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

        constructor() {
            super();
        }
    }
}

