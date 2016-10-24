///<reference path="./IEntity.ts" />
///<reference path="./EntityConfig.ts" />
module Entity
{
    export class Entity_City implements IEntity {

        private name: string = "city";

        Name(): string
        {
            return this.name;
        }


        private entity: string[]

        Entity(): string[]
        {
            return this.entity;
        }

        dictory: Object;

        query(queryString) {
            this.entity = Array<string>();
            for (var key in this.dictory){
                if (queryString.indexOf(key) > -1) {
                    this.entity.push(this.dictory[key]);
                }
            }
        }
        constructor()
        {
            this.dictory =

                {
                    北京: "北京",
                    上海: "上海"
                };
        }
    }
    var a = new Entity_City();
    a.query("上海天气怎么样");
    console.log(a.Entity[0]);
}



