"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//存在问题 Entity的 dictory直接写在 类里面 后面需要修改
var Entity;
(function (Entity_1) {
    // 一般查询的实体 结果会是多个
    function CommonQuery(Entity, queryString) {
        var _entity = Array();
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
    function CommonQueryOnlyOne(Entity, queryString) {
        var _entity = Array();
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
    var BaseEntity = (function () {
        function BaseEntity() {
            //========================================================================================================================
            //  基本方法
            //========================================================================================================================
            this.name = "";
            this.tag = 1;
            //实体的具体
            this.entity = [];
            this.SetFucChooseListItem = null;
            this.SetFucBoolListItem = null;
        }
        //一般实体的查询
        BaseEntity.prototype.query = function (queryString, args) {
            CommonQuery(this, queryString);
        };
        //AI请求的实体的查询
        BaseEntity.prototype.quest = function (queryString) {
            CommonQueryOnlyOne(this, queryString);
        };
        //boolean 执行结果 ！！！！！！！必须要继承实现 actionReq为null ActionRes的res填写结果
        BaseEntity.prototype.execute = function (actionReq, callback) {
            var result = { "res": false };
            if (this.entity.length > 0) {
                result.res = true;
            }
            callback(result);
        };
        ;
        BaseEntity.prototype.chooseListItem = function (queryString) {
            if (null != this.SetFucChooseListItem) {
                this.SetFucChooseListItem(queryString);
            }
            else {
                console.log(this.name + "is not extend function chooseListItem");
            }
        };
        BaseEntity.prototype.chooseBoolItem = function () {
            if (null != this.SetFucBoolListItem) {
                this.SetFucBoolListItem();
            }
            else {
                console.log(this.name + "is not extend function chooseBoolItem");
            }
        };
        return BaseEntity;
    }());
    function CreatEntityObject(EntityName) {
        var EntityConfig_ = {
            city: Entity_City,
            Data: Entity_Data,
            goodtype: Entity_goodtype,
            ensure: Entity_ensure,
            list: Entity_list,
            good: Entity_good,
            goodtag: Entity_goodtag,
        };
        var EntityObject = new EntityConfig_[EntityName]();
        return EntityObject;
    }
    Entity_1.CreatEntityObject = CreatEntityObject;
    //========================================================================================================================
    //  Entitys 简单关键字实体
    //========================================================================================================================
    //城市
    var Entity_City = (function (_super) {
        __extends(Entity_City, _super);
        function Entity_City() {
            _super.call(this);
            this.name = "city";
            this.tag = 0;
            this.dictory =
                {
                    上海: "上海",
                    北京: "北京",
                };
        }
        return Entity_City;
    }(BaseEntity));
    Entity_1.Entity_City = Entity_City;
    //商品类型
    var Entity_goodtype = (function (_super) {
        __extends(Entity_goodtype, _super);
        function Entity_goodtype() {
            _super.call(this);
            this.name = "goodtype";
            this.tag = 0;
            this.dictory =
                {
                    牛奶: "牛奶",
                    鸡蛋: "鸡蛋",
                    苹果: "苹果",
                };
        }
        return Entity_goodtype;
    }(BaseEntity));
    Entity_1.Entity_goodtype = Entity_goodtype;
    //相对时间 （昨天 今天 明天 后天）
    var Entity_Data = (function (_super) {
        __extends(Entity_Data, _super);
        function Entity_Data() {
            _super.call(this);
            this.name = "Data";
            this.tag = 0;
            this.dictory =
                {
                    昨天: "昨天",
                    今天: "今天",
                    明天: "明天",
                    后天: "后天"
                };
        }
        return Entity_Data;
    }(BaseEntity));
    Entity_1.Entity_Data = Entity_Data;
    //家电类型
    var Entity_ApplianceType = (function (_super) {
        __extends(Entity_ApplianceType, _super);
        function Entity_ApplianceType() {
            _super.call(this);
            this.name = "ApplianceType";
            this.tag = 0;
            this.dictory =
                {
                    电视: "电视",
                    空调: "空调",
                };
        }
        return Entity_ApplianceType;
    }(BaseEntity));
    Entity_1.Entity_ApplianceType = Entity_ApplianceType;
    //家电控制方式
    var Entity_ControlType = (function (_super) {
        __extends(Entity_ControlType, _super);
        function Entity_ControlType() {
            _super.call(this);
            this.name = "ControlType";
            this.tag = 0;
            this.dictory =
                {
                    打开: "开",
                    关闭: "关",
                };
        }
        return Entity_ControlType;
    }(BaseEntity));
    Entity_1.Entity_ControlType = Entity_ControlType;
    //家电昵称
    var Entity_AppliancePetName = (function (_super) {
        __extends(Entity_AppliancePetName, _super);
        function Entity_AppliancePetName() {
            _super.call(this);
            this.name = "AppliancePetName";
            this.tag = 0;
            this.dictory =
                {
                    小电: "电视",
                    小空: "空调",
                };
        }
        return Entity_AppliancePetName;
    }(BaseEntity));
    Entity_1.Entity_AppliancePetName = Entity_AppliancePetName;
    //数值（0 1 2 3）
    var Entity_BuiltinNumber = (function (_super) {
        __extends(Entity_BuiltinNumber, _super);
        function Entity_BuiltinNumber() {
            _super.apply(this, arguments);
            this.name = "";
            this.tag = 0;
            //实体的具体
            this.entity = [];
        }
        //一般实体的查询
        Entity_BuiltinNumber.prototype.query = function (queryString, args) {
            for (var num = 0; num < args.length; num++) {
                if (args[num].type == "builtin.number")
                    this.entity.push(args[num].entity);
            }
        };
        return Entity_BuiltinNumber;
    }(BaseEntity));
    Entity_1.Entity_BuiltinNumber = Entity_BuiltinNumber;
    //家庭区域
    var Entity_Location = (function (_super) {
        __extends(Entity_Location, _super);
        function Entity_Location() {
            _super.call(this);
            this.name = "Location";
            this.tag = 0;
            this.dictory =
                {
                    客厅: "客厅",
                    卧室: "卧室",
                };
        }
        return Entity_Location;
    }(BaseEntity));
    Entity_1.Entity_Location = Entity_Location;
    //商品标签 便宜 换一批等
    var Entity_goodtag = (function (_super) {
        __extends(Entity_goodtag, _super);
        function Entity_goodtag() {
            _super.call(this);
            this.name = "goodtag";
            this.tag = 0;
            this.dictory =
                {
                    便宜: "便宜",
                    有点贵: "便宜",
                    太贵: "便宜",
                    换: "换",
                };
        }
        return Entity_goodtag;
    }(BaseEntity));
    Entity_1.Entity_goodtag = Entity_goodtag;
    //========================================================================================================================
    //  Entitys 类bool实体
    //========================================================================================================================
    var Entity_ensure = (function (_super) {
        __extends(Entity_ensure, _super);
        function Entity_ensure() {
            _super.call(this);
            this.name = "_ensure";
            this.tag = 1;
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
        Entity_ensure.prototype.query = function (queryString, args) {
            console.log("Entity__ensure query function");
        };
        return Entity_ensure;
    }(BaseEntity));
    Entity_1.Entity_ensure = Entity_ensure;
    //========================================================================================================================
    //  Entitys 列表实体
    //========================================================================================================================
    var Entity_list = (function (_super) {
        __extends(Entity_list, _super);
        function Entity_list() {
            var _this = this;
            _super.call(this);
            this.name = "list";
            this.tag = 0;
            this.ListItem = [];
            this.choosedItem = -1;
            this.choosedItemstr = "";
            this.SetFucChooseListItem = function (queryString) {
                console.log(0);
                for (var key in _this.ListItem) {
                    if (_this.ListItem[key].indexOf(queryString) >= 0) {
                        _this.entity = [key];
                        _this.choosedItem = parseInt(key);
                        _this.choosedItemstr = _this.ListItem[_this.choosedItem];
                        break;
                    }
                }
            };
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
        Entity_list.prototype.query = function (queryString, args) {
            console.log("Entity_list query function");
        };
        Entity_list.prototype.quest = function (queryString) {
            CommonQueryOnlyOne(this, queryString);
            if (this.entity.length > 0) {
                try {
                    this.choosedItem = parseInt(this.entity[0]);
                    this.choosedItemstr = this.ListItem[this.choosedItem];
                }
                catch (e) {
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
            else {
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
        };
        return Entity_list;
    }(BaseEntity));
    Entity_1.Entity_list = Entity_list;
    //========================================================================================================================
    //  Entitys 被动实体无法用户主动说明
    //========================================================================================================================
    //商品
    var Entity_good = (function (_super) {
        __extends(Entity_good, _super);
        function Entity_good() {
            _super.call(this);
            this.name = "good";
            this.tag = 0;
        }
        return Entity_good;
    }(BaseEntity));
    Entity_1.Entity_good = Entity_good;
})(Entity = exports.Entity || (exports.Entity = {}));
//# sourceMappingURL=IEntity.js.map