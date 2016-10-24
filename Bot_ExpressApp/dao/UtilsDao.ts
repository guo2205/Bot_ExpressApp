///<reference path="userSqlMapping.ts" />
///<reference path="../Scripts/typings/index.d.ts"/>
///<reference path="../conf/db.ts"/>
//实现与MySQL交互
import mysql = require('mysql');
import db = require('../conf/db');

export class userDao {

    //使用连接池，提示性能
    pool = mysql.createPool(db.mysql);


    /**
     * 查询方法
     * @param param 方法参数:{tableName:表名 , whereField: 条件}
     * @param callback 回调方法
     */
    public select(param: db.param, callback: (msg: db.result) => any)
    {
        this.pool.getConnection((err, conn) =>
        {
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            let tableName: string = param.tableName;
            let whereField: { key: any, value: any }[] = param.whereField;
            let sql: string = `select * from ${tableName} where `;
            let arr: Array<any> = [];
            let result: db.result;
            for (let i: number = 0; i < whereField.length; i++)
            {
                if (i>0)
                {
                    sql+='and '
                }

                sql += whereField[i].key + "=? ";
                arr.push(whereField[i].value);
            }
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
}


