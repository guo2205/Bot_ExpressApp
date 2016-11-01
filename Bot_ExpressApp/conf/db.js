"use strict";
/**
 * Created by Vincent on 2016/9/25.
 */
// MySQL数据库联接配置
exports.mysql = {
    host: '10.10.3.52',
    user: 'root',
    password: 'mypassword',
    database: 'ZhiNengJiaJu',
    port: 3306
};
exports.sql = {
    inster: "select * from ? where a=?,b=?"
};
var param = (function () {
    function param() {
        this.tableName = "";
        this.whereField = [];
    }
    return param;
}());
exports.param = param;
var sqlField = (function () {
    function sqlField() {
        this.sql = "";
        this.arr = [];
    }
    return sqlField;
}());
exports.sqlField = sqlField;
var result = (function () {
    function result(code, msg, info) {
        this.code = "";
        this.msg = "";
        this.code = code;
        this.msg = msg;
        this.info = info;
    }
    return result;
}());
exports.result = result;
//# sourceMappingURL=db.js.map