module Entity
{
    export interface IEntity {
        //实体的类型
        Name(): string;
        //实体的目录
        dictory: Object;
        //实体的数据
        Entity(): string[];
        //实体的查询
        query(queryString: string, args);
    }
}

