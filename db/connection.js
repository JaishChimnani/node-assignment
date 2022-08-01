"use strict";
const mongoose = require('mongoose');
// var studentSchema=require('../models/User.model');
var db = "mongodb+srv://jaish09:123456789j@cluster0.wjsff.mongodb.net/?retryWrites=true&w=majority";
var express = require(`express`);
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DATABASE CONNECTED");
});
