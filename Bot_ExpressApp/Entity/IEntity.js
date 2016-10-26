"use strict";
var Entity;
(function (Entity_1) {
    //========================================================================================================================
    //  Entitys
    //========================================================================================================================
    var Entity_City = (function () {
        function Entity_City() {
            this.name = "city";
            this.entity = [];
            this.dictory =
                {
                    北京: "北京",
                    上海: "上海"
                };
        }
        Entity_City.prototype.query = function (queryString) {
            CommonQuery(this, queryString);
        };
        Entity_City.prototype.execute = function (actionReq, callback) {
            var result = { "res": false };
            if (this.entity.length > 0) {
                result.res = true;
            }
            callback(result);
        };
        return Entity_City;
    }());
    Entity_1.Entity_City = Entity_City;
    var Entity_Data = (function () {
        function Entity_Data() {
            this.name = "Data";
            this.entity = [];
            this.dictory =
                {
                    昨天: "昨天",
                    今天: "今天",
                    明天: "明天",
                    后天: "后天"
                };
        }
        Entity_Data.prototype.query = function (queryString) {
            CommonQuery(this, queryString);
        };
        Entity_Data.prototype.execute = function (actionReq, callback) {
            var result = { "res": false };
            if (this.entity.length > 0) {
                result.res = true;
            }
            callback(result);
        };
        return Entity_Data;
    }());
    Entity_1.Entity_Data = Entity_Data;
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
})(Entity = exports.Entity || (exports.Entity = {}));
//# sourceMappingURL=IEntity.js.map