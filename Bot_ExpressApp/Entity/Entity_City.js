///<reference path="./IEntity.ts" />
///<reference path="./EntityConfig.ts" />
var Entity;
(function (Entity) {
    var Entity_City = (function () {
        function Entity_City() {
            this.name = "city";
            this.dictory =
                {
                    北京: "北京",
                    上海: "上海"
                };
        }
        Entity_City.prototype.Name = function () {
            return this.name;
        };
        Entity_City.prototype.Entity = function () {
            return this.entity;
        };
        Entity_City.prototype.query = function (queryString) {
            this.entity = Array();
            for (var key in this.dictory) {
                if (queryString.indexOf(key) > -1) {
                    this.entity.push(this.dictory[key]);
                }
            }
        };
        return Entity_City;
    }());
    Entity.Entity_City = Entity_City;
    var a = new Entity_City();
    a.query("上海天气怎么样");
    console.log(a.Entity[0]);
})(Entity || (Entity = {}));
//# sourceMappingURL=Entity_City.js.map