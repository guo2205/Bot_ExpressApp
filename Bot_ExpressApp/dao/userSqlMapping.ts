namespace user {
    export let insert: string = 'INSERT INTO user(user, password) VALUES(?,?)';
    export let update: string = 'update user set user=?, password=? where id=?';
    export let del: string = 'delete from user where id=?';
    export let queryById: string = 'select * from user where id=?';
    export let queryAll: string = 'select * from user';
};