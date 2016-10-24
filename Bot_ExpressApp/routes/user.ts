"use strict";
var express = require('express');
var router = express.Router();
import userDao = require('../dao/userDao');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
router.get('/login', function (req, res, next) {
    res.render('login', {
        title: '啊啊啊啊啊',
        user: { name: '飞起' }
    });
});
router.get('/register', function (req, res, next) {
    res.render('register', {
        title: '注册'
    });
});
// 增加用户
//TODO 同时支持get,post
router.get('/addUser', function (req, res, next) {
    userDao.add(req, res, next);
});
router.get('/queryAll', function (req, res, next) {
    userDao.queryAll(req, res, next);
});
router.get('/query', function (req, res, next) {
    userDao.queryById(req, res, next);
});
router.get('/deleteUser', function (req, res, next) {
    userDao.delete(req, res, next);
});
router.post('/updateUser', function (req, res, next) {
    userDao.update(req, res, next);
});
module.exports = router;
//# sourceMappingURL=user.js.map