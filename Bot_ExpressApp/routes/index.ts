/*
 * GET home page.
 */
///<reference path="../Data.ts" />
import express = require('express');
import * as Data from "../Data";

export function index(req: express.Request, res: express.Response) {
    /*
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
    */
    Data.Data.post(req, res);

    
    
};

export function about(req: express.Request, res: express.Response) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
};

export function contact(req: express.Request, res: express.Response) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};

export function bot(req: express.Request, res: express.Response) {
    res.render('bot.html');
};
