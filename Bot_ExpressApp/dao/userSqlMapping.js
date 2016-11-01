var user;
(function (user) {
    user.insert = 'INSERT INTO user(user, password) VALUES(?,?)';
    user.update = 'update user set user=?, password=? where id=?';
    user.del = 'delete from user where id=?';
    user.queryById = 'select * from user where id=?';
    user.queryAll = 'select * from user';
})(user || (user = {}));
;
//# sourceMappingURL=userSqlMapping.js.map