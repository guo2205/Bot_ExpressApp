"use strict";
///<reference path="../Enum.ts"/>
var redis = require('redis');
var Redis = (function () {
    function Redis(collection) {
        //private RedisHost: string = "zhinengjiaju-db.chinacloudapp.cn";
        this.RedisHost = "10.10.3.52";
        this.expire = 300;
        this.RedisPort = 6379;
        this.ClientOpts = { password: "test123" };
        this.RC = redis.createClient(this.RedisPort, this.RedisHost, this.ClientOpts);
        this.RC.select(collection);
    }
    //断开链接
    Redis.prototype.Quit = function () {
        this.RC.quit();
    };
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
    //存入一段字符串并设置时间如果key有就覆盖
    Redis.prototype.SetStringAndExpire = function (key, value, expire, fun) {
        this.RC.set(key, value);
        this.RC.expire(key, expire, fun);
    };
    //存入一段字符串如果key有就覆盖
    Redis.prototype.SetString = function (key, value, fun) {
        this.RC.set(key, value, fun);
    };
    //存入一段字符串如果key有则不存
    Redis.prototype.SetValueNX = function (key, value, fun) {
        this.RC.setnx(key, value, fun);
    };
    //获得数据
    Redis.prototype.GetString = function (key, fun) {
        this.RC.get(key, fun);
    };
    //移除数据
    Redis.prototype.RemoveData = function (key, fun) {
        this.RC.del(key, fun);
    };
    //查询一个KEY是否存在  1是存在  0是不存在
    Redis.prototype.Exists = function (key, fun) {
        this.RC.exists(key, fun);
    };
    //获取随机一个key
    Redis.prototype.GetRandomKey = function (fun) {
        this.RC.randomkey(fun);
    };
    //-----------------------------------------------list 的操作
    //存入数据---默认往上存
    Redis.prototype.SetItemToList = function (key, value, fun) {
        this.RC.lpush(key, value, fun);
    };
    //存入数据---往上存
    Redis.prototype.SetItemToList_Left = function (key, value, fun) {
        this.RC.lpush(key, value, fun);
    };
    //存入数据---往下存
    Redis.prototype.SetItemToList_Right = function (key, value, fun) {
        this.RC.rpush(key, value, fun);
    };
    //获得列表数据
    Redis.prototype.GetList = function (key, fun) {
        this.RC.lrange(key, 0, -1, fun);
    };
    //移除list中的某个数据-----------没找到方法
    Redis.prototype.DeleteSomeOneItemFromList = function (key, value, fun) {
    };
    //移除List中的第一个数据
    Redis.prototype.DeleteFirstItemFromList = function (key, fun) {
        this.RC.lpop(key, fun);
    };
    //移除List中的最后一个数据
    Redis.prototype.DeleteLastItemFromList = function (key, fun) {
        this.RC.rpop(key, fun);
    };
    //-----------------------------------------------
    //-----------------------------------------------Hash 的操作
    //存入一条数据
    Redis.prototype.SetItemToHash = function (key, fieldKey, fieldValue, fun) {
        this.RC.hset(key, fieldKey, fieldValue, fun);
    };
    //存入很多数据 -----要改
    Redis.prototype.SetItemsToHash = function (key, field, string, fun) {
        var list = [];
        for (var i = 1; i < field.length; i++) {
            list.push(field[i].fieldKey);
            list.push(field[i].fieldValue);
        }
        this.RC.hmset(key, list, fun);
    };
    //取对应键的值
    Redis.prototype.GetItemFromHash = function (key, fieldKey, fun) {
        this.RC.hget(key, fieldKey, fun);
    };
    //取出所有的键值对
    Redis.prototype.GetAllItemFromHash = function (key, fun) {
        this.RC.hgetall(key, fun);
    };
    //检查是否含有给定键  0 是没有  1是有
    Redis.prototype.HashExists = function (key, fieldKey, fun) {
        this.RC.hexists(key, fieldKey, fun);
    };
    //获取HASH表所有的key值
    Redis.prototype.GetHashKeys = function (key, fun) {
        this.RC.hkeys(key, fun);
    };
    //获取HASH表所有的值
    Redis.prototype.GetHashValues = function (key, fun) {
        this.RC.hvals(key, fun);
    };
    //获取HASH表里面的数量
    Redis.prototype.GetHashKeyValNumber = function (key, fun) {
        this.RC.hlen(key, fun);
    };
    return Redis;
}());
exports.Redis = Redis;
//# sourceMappingURL=RedisHelper.js.map