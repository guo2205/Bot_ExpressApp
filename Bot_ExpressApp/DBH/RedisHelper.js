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
        //event: connect
        // event: error
        // event: message
        // event: pmessage
        // event: subscribe
        // event: psubscribe
        // event: unsubscribe
        // event: punsubscribe
        this.RC.on("connect", function (err) { console.log("connect:" + err); });
        this.RC.on("error", function (err) { console.log("error:" + err); });
        this.RC.on("message", function (err) { console.log("message:" + err); });
        this.RC.on("subscribe", function (err) { console.log("subscribe:" + err); });
        this.RC.on("psubscribe", function (err) { console.log("psubscribe:" + err); });
        this.RC.on("unsubscribe", function (err) { console.log("unsubscribe:" + err); });
        this.RC.on("punsubscribe", function (err) { console.log("punsubscribe:" + err); });
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
    ////存入一段字符串并设置时间如果key有就覆盖
    //public SetStringAndExpire(key: any, value: any, expire: number, fun?: ResCallbackT<any>)
    //{
    //    this.RC.set(key, value);
    //    this.RC.expire(key, expire, fun);
    //}
    //存入一段字符串如果key有就覆盖
    Redis.prototype.SetString = function (key, value, fun, expire) {
        var _this = this;
        this.RC.set(key, value, function (err, res) {
            if (expire > 0)
                _this.RC.expire(key, expire, fun);
            else
                fun(err, res);
        });
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
    Redis.prototype.DeleteData = function (key, fun) {
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
    //存入数据---默认(后一个数据在前一个上面)
    Redis.prototype.SetItemToList = function (key, value, fun, expire) {
        var _this = this;
        this.RC.lpush(key, value, function (err, res) {
            if (expire > 0)
                _this.RC.expire(key, expire, fun);
            else
                fun(err, res);
        });
    };
    //存入数据---(后一个数据在前一个上面)
    Redis.prototype.SetItemToList_Left = function (key, value, fun, expire) {
        var _this = this;
        this.RC.lpush(key, value, function (err, res) {
            if (expire > 0)
                _this.RC.expire(key, expire, fun);
            else
                fun(err, res);
        });
    };
    //存入数据---(后一个数据在前一个下面)
    Redis.prototype.SetItemToList_Right = function (key, value, expire, fun) {
        var _this = this;
        this.RC.rpush(key, value, function (err, res) {
            if (expire > 0)
                _this.RC.expire(key, expire, fun);
            else
                fun(err, res);
        });
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
    Redis.prototype.SetItemToHash = function (key, fieldKey, fieldValue, fun, expire) {
        var _this = this;
        this.RC.hdel(key, fieldKey, fieldValue, function (err, res) {
            _this.RC.hset(key, fieldKey, fieldValue, function (err, res) {
                if (expire > 0)
                    _this.RC.expire(key, expire, fun);
                else
                    fun(err, res);
            });
        });
    };
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
    Redis.prototype.GetItemFromHash = function (key, fieldKey, fun) {
        this.RC.hget(key, fieldKey, fun);
    };
    //取出所有的键值对并转换成obj[]  ---【{key:value},{key2:value2}】
    Redis.prototype.GetAllItemFromHashAndParse = function (key, fun) {
        this.RC.hgetall(key, function (err, res) {
            var obj = [];
            for (var key in res) {
                obj.push({ key: res[key] });
            }
            fun(err, obj);
        });
    };
    //取出所有的键值对  ---{key:value,key2:value2}
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
    //移除HASH表
    Redis.prototype.DeleteHash = function (key, fun) {
        this.RC.del(key, fun);
    };
    //移除HASH表里面的某个键值对
    Redis.prototype.DeleteItemFromHash = function (key, fieldKey, fun) {
        this.RC.hdel(key, fieldKey, fun);
    };
    //移除HASH表最新的键值队
    Redis.prototype.DeleteFirstItemFromHash = function (key, fun) {
        var _this = this;
        var list = [];
        this.GetHashKeys(key, function (err, res) { list = res; _this.DeleteItemFromHash(key, list[list.length - 1], fun); });
    };
    //移除HASH表最旧的键值队
    Redis.prototype.DeleteLastItemFromHash = function (key, fun) {
        var _this = this;
        var list = [];
        this.GetHashKeys(key, function (err, res) {
            list = res;
            _this.DeleteItemFromHash(key, list[0], fun);
        });
    };
    Redis.prototype.EventOn = function () {
    };
    return Redis;
}());
exports.Redis = Redis;
//# sourceMappingURL=RedisHelper.js.map