"use strict";
///<reference path="../Scripts/typings/index.d.ts"/>
///<reference path="../conf/db.ts"/>
var mysql = require('mysql');
var db = require('../conf/db');
var pool = mysql.createPool(db.mysql);
function query(sql, arr, callback) {
    pool.getConnection(function (err, conn) {
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
}
exports.query = query;
//# sourceMappingURL=mysqlConn.js.map