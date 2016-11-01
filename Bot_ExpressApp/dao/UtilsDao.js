"use strict";
///<reference path="../Scripts/typings/index.d.ts"/>
///<reference path="../conf/db.ts"/>
///<reference path="../utils/mysqlConn.ts"/>
//实现与MySQL交互
var mysql = require('mysql');
var db = require('../conf/db');
var conn = require('../utils/mysqlConn');
var utilDao = (function () {
    function utilDao() {
        //使用连接池，提示性能
        this.pool = mysql.createPool(db.mysql);
    }
    /**
     * 数据库sql执行方法
     * @param param
     * @param callback 回调方法
    public query(sql: string, arr: Array<any>, callback: (msg: db.result) => any)
    {
        this.pool.getConnection((err, conn) =>
        {

            let result: db.result;
            conn.query(sql, arr, function (err, ret) {
                if (ret) {
                    result = new db.result('1', '成功', ret);
                    callback(result);
                } else {
                    result = new db.result('0', '失败',err);
                    callback(result);
                }

                // 释放连接
                conn.release();
            });
        })
    }
     */
    /**
     * 数据库记录查询方法(组装select语句)
     * @param param 方法参数:{tableName:表名 , whereField: 条件}
     * @param callback
     */
    utilDao.prototype.select = function (param, callback) {
        var myDate = new Date();
        var start = myDate.getMilliseconds();
        // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
        var tableName = param.tableName;
        var whereField = param.whereField;
        var sql = "select * from " + tableName + " where ";
        var arr = [];
        var time1 = new Date();
        console.log("start:" + (time1.getTime() - myDate.getTime()));
        //循环where条件生成SQL
        var _loop_1 = function(i) {
            if (i > 0) {
                sql += 'and ';
            }
            var time2 = new Date().getMilliseconds();
            //console.log(time2 - time1);
            //select * from where a=?
            sql += whereField[i].key + "=? ";
            arr.push(whereField[i].value);
            //调用sql执行方法
            conn.query(sql, arr, function (msg) {
                var time3 = new Date().getMilliseconds();
                console.log(time3 - time2);
                callback(msg);
            });
        };
        for (var i = 0; i < whereField.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * 数据库表记录添加方法(组装insert语句)
     * @param param
     * @param callback
     */
    utilDao.prototype.add = function (param, callback) {
        // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
        var tableName = param.tableName;
        var whereField = param.whereField;
        var sql = "insert into * from " + tableName + " where ";
        var arr = [];
        //循环where条件生成SQL
        for (var i = 0; i < whereField.length; i++) {
            if (i > 0) {
                sql += 'and ';
            }
            //select * from where a=?
            sql += whereField[i].key + "=? ";
            arr.push(whereField[i].value);
            //调用sql执行方法
            conn.query(sql, arr, callback);
        }
    };
    /**
     * 数据库表记录删除方法(组装delete语句)
     * @param param
     * @param callback
     */
    utilDao.prototype.remove = function (param, callback) {
        //
    };
    return utilDao;
}());
exports.utilDao = utilDao;
//# sourceMappingURL=UtilsDao.js.map