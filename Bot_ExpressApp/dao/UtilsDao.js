"use strict";
///<reference path="userSqlMapping.ts" />
///<reference path="../Scripts/typings/index.d.ts"/>
///<reference path="../conf/db.ts"/>
//实现与MySQL交互
var mysql = require('mysql');
var db = require('../conf/db');
var utilDao = (function () {
    function utilDao() {
        //使用连接池，提示性能
        this.pool = mysql.createPool(db.mysql);
    }
    /**
     * 数据库sql执行方法
     * @param param
     * @param callback 回调方法
     */
    utilDao.prototype.query = function (sql, arr, callback) {
        this.pool.getConnection(function (err, conn) {
            var result;
            conn.query(sql, arr, function (err, ret) {
                if (ret) {
                    result = new db.result('1', '成功', ret);
                    callback(result);
                }
                else {
                    result = new db.result('0', '失败', err);
                    callback(result);
                }
                // 释放连接
                conn.release();
            });
        });
    };
    /**
     * 数据库记录查询方法(组装select语句)
     * @param param 方法参数:{tableName:表名 , whereField: 条件}
     * @param callback
     */
    utilDao.prototype.select = function (param, callback) {
        // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
        var tableName = param.tableName;
        var whereField = param.whereField;
        var sql = "select * from " + tableName + " where ";
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
            this.query(sql, arr, callback);
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
            this.query(sql, arr, callback);
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