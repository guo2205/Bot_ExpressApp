"use strict";
var Data = require("../Data");
function index(req, res) {
    /*
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
    */
    Data.Data.post(req, res);
}
exports.index = index;
;
function about(req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
}
exports.about = about;
;
function contact(req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
}
exports.contact = contact;
;
function bot(req, res) {
    res.render('bot.html');
}
exports.bot = bot;
;
//# sourceMappingURL=index.js.map