///<reference path="../Scripts/typings/index.d.ts"/>
///<reference path="../conf/db.ts"/>
///<reference path="../utils/mysqlConn.ts"/>
//实现与MySQL交互
import mysql = require('mysql');
import db = require('../conf/db');
import conn = require('../utils/mysqlConn');

export class utilDao {

    //使用连接池，提示性能
    pool = mysql.createPool(db.mysql);


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
    public select(param: db.param, callback: (msg: db.result) => any)
    {
        let myDate = new Date();
        let start = myDate.getMilliseconds();
        // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
        let tableName: string = param.tableName;
        let whereField: { key: any, value: any }[] = param.whereField;
        let sql: string = `select * from ${tableName} where `;
        let arr: Array<any> = [];
        let time1 = new Date();
        console.log("start:" + (time1.getTime() - myDate.getTime()));
        //循环where条件生成SQL
        for (let i: number = 0; i < whereField.length; i++) {
            if (i > 0) {
                sql += 'and '
            }
            let time2 = new Date().getMilliseconds();
            //console.log(time2 - time1);
        //select * from where a=?
            sql += whereField[i].key + "=? ";
            arr.push(whereField[i].value);
            //调用sql执行方法
            conn.query(sql, arr, (msg: db.result) => {
                let time3 = new Date().getMilliseconds();
                console.log(time3 - time2);
                callback(msg);
            });

        }
    }

    /**
     * 数据库表记录添加方法(组装insert语句)
     * @param param
     * @param callback
     */
    public add(param: db.param, callback: (msg: db.result) => any)
    {
        // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
        let tableName: string = param.tableName;
        let whereField: { key: any, value: any }[] = param.whereField;
        let sql: string = `insert into * from ${tableName} where `;
        let arr: Array<any> = [];
        //循环where条件生成SQL
        for (let i: number = 0; i < whereField.length; i++) {
            if (i > 0) {
                sql += 'and '
            }
            //select * from where a=?
            sql += whereField[i].key + "=? ";
            arr.push(whereField[i].value);
            //调用sql执行方法
            conn.query(sql, arr, callback);
        }
    }

    /**
     * 数据库表记录删除方法(组装delete语句)
     * @param param
     * @param callback
     */
    public remove(param: db.param, callback: (msg: db.result) => any)
    {
        //
    }

}

