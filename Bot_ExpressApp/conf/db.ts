/**
 * Created by Vincent on 2016/9/25.
 */
// MySQL数据库联接配置
export let mysql =
    {
        host: '10.10.3.52',
        user: 'root',
        password: 'root',
        database: 'mypassword', // 前面建的user表位于这个数据库中
        port: 3306
    }

export let sql =
    {
        inster: "select * from ? where a=?,b=?"

    }


export class param
{
    tableName: string = "";
    whereField: { key: string, value: any }[] = [];
}

export class result
{
    code: string = "";
    msg: string = "";
    info: any;
    constructor(code: string, msg: string, info: any) {
        this.code = code;
        this.msg = msg;
        this.info = info;
    }
}