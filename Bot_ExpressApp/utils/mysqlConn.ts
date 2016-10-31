///<reference path="../Scripts/typings/index.d.ts"/>
///<reference path="../conf/db.ts"/>
import mysql = require('mysql');
import db = require('../conf/db');
let pool = mysql.createPool(db.mysql);
export function query (sql: string, arr: Array<any>, callback: (msg: db.result) => any)
{
    pool.getConnection((err, conn) => {

        let result: db.result;
        conn.query(sql, arr, function (err, ret) {
            if (ret) {
                result = new db.result('1', '成功', ret);
                callback(result);
            } else {
                result = new db.result('0', '失败', err);
                callback(result);
            }

            // 释放连接
            conn.release();
        });
    })
}