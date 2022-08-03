"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require('jsonwebtoken');
const authUser = require('./models/Auth.User.model');
const cookieParser = require('cookie-parser');
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("0");
        const token = req.cookies.jwt;
        console.log("1" + token);
        const verifyUser = jwt.verify(token, "mynameisjaishchimnaniabtechstudent");
        console.log("2");
        console.log(verifyUser);
        const user = yield authUser.findOne({ _id: verifyUser._id });
        console.log("3");
        console.log(user);
        req.token = token;
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        // alert("session Expired");
        res.redirect('/login');
    }
});
module.exports = auth;
