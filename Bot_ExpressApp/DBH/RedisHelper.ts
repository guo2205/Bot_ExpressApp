///<reference path="../Enum.ts"/>
import redis = require('redis');
import * as enumclass from "../Enum";

export interface ResCallbackT<R> {
    (err: Error, res: R): void;
}
export class Redis
{
    //private RedisHost: string = "zhinengjiaju-db.chinacloudapp.cn";
    private RedisHost: string = "10.10.3.52";
    private expire: number = 300;
    private RedisPort: number = 6379;
    private RC: redis.RedisClient;
    private ClientOpts: redis.ClientOpts = { password: "test123"};


    constructor(collection: enumclass.RedisCollection) {

        this.RC = redis.createClient(this.RedisPort, this.RedisHost, this.ClientOpts);
   
        this.RC.select(collection);
        //event: connect
        // event: error
        // event: message
        // event: pmessage
        // event: subscribe
        // event: psubscribe
        // event: unsubscribe
        // event: punsubscribe
        this.RC.on("connect", (err) => { console.log("connect:" +err)});
        this.RC.on("error", (err) => { console.log("error:" +err) });
        this.RC.on("message", (err) => { console.log("message:" +err) });
        this.RC.on("subscribe", (err) => { console.log("subscribe:" +err) });
        this.RC.on("psubscribe", (err) => { console.log("psubscribe:" +err)});
        this.RC.on("unsubscribe", (err) => { console.log("unsubscribe:" +err) });
        this.RC.on("punsubscribe", (err) => { console.log("punsubscribe:" +err)});
    }

    //断开链接
    public Quit()
    {
        this.RC.quit();
    }


    //////存入一段字符串
    //public SetString(x: { key: any, value: any }, fun?: ResCallbackT<any>)
    ////存入一段字符串并设置时间
    //public SetString(x: { key: any, value: any, expire: number }, fun?: ResCallbackT<any>)
    //
    //public SetString(x: any, fun?: ResCallbackT<any>)
    //{
    //    if (typeof x.expire == "undefined") {
    //        var flg: boolean = this.RC.set(x.key, x.value, fun);
    //    }
    //    else if (typeof x.expire == "number")
    //    {
    //        var flg: boolean = this.RC.set(x.key, x.value, fun);
    //        this.RC.expire(x.key, x.expire);
    //    }
    //}

    ////存入一段字符串并设置时间如果key有就覆盖
    //public SetStringAndExpire(key: any, value: any, expire: number, fun?: ResCallbackT<any>)
    //{
    //    this.RC.set(key, value);
    //    this.RC.expire(key, expire, fun);
    //}
    //存入一段字符串如果key有就覆盖
    public SetString(key: any, value: any, fun: ResCallbackT<string>, expire?: number)
    {
        this.RC.set(key, value, (err, res) => {
            if (expire > 0)
                this.RC.expire(key, expire, fun);
            else
                fun(err, res);
        });
    }
    //存入一段字符串如果key有则不存
    public SetValueNX(key: any, value: any, fun: ResCallbackT<string>)
    {
        this.RC.setnx(key, value,fun);
    }
    //获得数据
    public GetString(key: any, fun: ResCallbackT<string>)
    {
        this.RC.get(key, fun);
    }
    //移除数据
    public DeleteData(key: any, fun: ResCallbackT<string>) {
        this.RC.del(key, fun);
    }
    //查询一个KEY是否存在  1是存在  0是不存在
    public Exists(key: string, fun: ResCallbackT<string>)
    {
        this.RC.exists(key,fun);
    }
    //获取随机一个key
    public GetRandomKey(fun: ResCallbackT<number | string>)
    {
        this.RC.randomkey(fun);
    }



    //-----------------------------------------------list 的操作
    //存入数据---默认(后一个数据在前一个上面)
    public SetItemToList(key: any, value: any, fun: ResCallbackT<string>, expire?: number) {
        this.RC.lpush(key, value, (err, res) =>
        {
            if (expire > 0)
                this.RC.expire(key, expire, fun);
            else
                fun(err, res);
        });
    }
    //存入数据---(后一个数据在前一个上面)
    public SetItemToList_Left(key: any, value: any, fun: ResCallbackT<string>, expire?: number)
    {
        this.RC.lpush(key, value, (err, res) =>
        {
            if (expire > 0)
                this.RC.expire(key, expire, fun);
            else
                fun(err, res);
        });
    }
    //存入数据---(后一个数据在前一个下面)
    public SetItemToList_Right(key: any, value: any, expire: number, fun: ResCallbackT<string>) {
        this.RC.rpush(key, value, (err, res) =>
        {
            if (expire > 0)
                this.RC.expire(key, expire, fun);
            else
                fun(err, res);
        });
        
    }
    //获得列表数据
    public GetList(key: any, fun: ResCallbackT<string[]>)
    {
        this.RC.lrange(key, 0, -1, fun);

    }
    //移除list中的某个数据-----------没找到方法
    public DeleteSomeOneItemFromList(key: any, value: any, fun: ResCallbackT<any>)
    {

    }
    //移除List中的第一个数据
    public DeleteFirstItemFromList(key: any, fun: ResCallbackT<string>)
    {
        this.RC.lpop(key, fun);
    }
    //移除List中的最后一个数据
    public DeleteLastItemFromList(key: any, fun: ResCallbackT<string>)
    {
        this.RC.rpop(key, fun);
    }
    //-----------------------------------------------


    //-----------------------------------------------Hash 的操作
    //存入一条数据
    public SetItemToHash(key: any, fieldKey: any, fieldValue, fun: ResCallbackT<string>, expire?: number)
    {
        this.RC.hdel(key, fieldKey, fieldValue, (err,res) =>
        {
            this.RC.hset(key, fieldKey, fieldValue, (err, res) =>
            {
                if (expire > 0)
                    this.RC.expire(key, expire, fun);
                else
                    fun(err, res);
            });
        });
      
      
    }
    //存入很多数据 -----暂时别用要改
    //public SetItemsToHash(key: any, field: { fieldKey: any, fieldValue: any }[], fun: ResCallbackT<string>, expire?: number)
    //{
    //
    //    var list: Array<string> = [];
    //    for (var i: number = 1; i < field.length; i++)
    //    {
    //        list.push(field[i].fieldKey);
    //        list.push(field[i].fieldValue);
    //    }
    //    this.RC.hmset(key, list, fun);
    //    if (expire > 0)
    //        this.RC.expire(key, expire, fun);
    //}
    //取对应键的值
    public GetItemFromHash(key: any, fieldKey: any, fun?: ResCallbackT<any>)
    {
        this.RC.hget(key, fieldKey, fun);
    }
    //取出所有的键值对并转换成obj[]  ---【{key:value},{key2:value2}】
    public GetAllItemFromHashAndParse(key: any, fun: ResCallbackT<Object[]>)
    {
        this.RC.hgetall(key, (err, res: Object) =>
        {
            let obj: Object[] = [];
            for (var key in res)
            {
                obj.push({ key: res[key] });
            }
            fun(err, obj);
        }
        );
    }
    //取出所有的键值对  ---{key:value,key2:value2}
    public GetAllItemFromHash(key: any, fun: ResCallbackT<Object>) {
        this.RC.hgetall(key, fun);
    }
    //检查是否含有给定键  0 是没有  1是有
    public HashExists(key: any, fieldKey: any, fun: ResCallbackT<string>)
    {
        this.RC.hexists(key, fieldKey, fun);
    }
    //获取HASH表所有的key值
    public GetHashKeys(key: any, fun: ResCallbackT<string[]>)
    {
        this.RC.hkeys(key, fun);
    }
    //获取HASH表所有的值
    public GetHashValues(key: any, fun: ResCallbackT<string[]>)
    {
        this.RC.hvals(key, fun);
    }
    //获取HASH表里面的数量
    public GetHashKeyValNumber(key: any, fun: ResCallbackT<number>)
    {
        this.RC.hlen(key, fun);
    }
    //移除HASH表
    public DeleteHash(key: any, fun: ResCallbackT<string>)
    {
        this.RC.del(key, fun);
    }
    //移除HASH表里面的某个键值对
    public DeleteItemFromHash(key: any, fieldKey: any, fun: ResCallbackT<string>)
    {
        this.RC.hdel(key, fieldKey, fun);
    }
    //移除HASH表最新的键值队
    public DeleteFirstItemFromHash(key: any, fun: ResCallbackT<string>)
    {
        let list: Array<any> = [];
        this.GetHashKeys(key, (err, res) => { list = res; this.DeleteItemFromHash(key, list[list.length - 1], fun); });
        
    }
    //移除HASH表最旧的键值队
    public DeleteLastItemFromHash(key: any, fun: ResCallbackT<string>)
    {
        let list: Array<any> = [];
        this.GetHashKeys(key, (err, res) => {
            list = res; this.DeleteItemFromHash(key, list[0], fun);
        });
       
    }
    public EventOn()
    {
        
    }
    //-----------------------------------------------

}

