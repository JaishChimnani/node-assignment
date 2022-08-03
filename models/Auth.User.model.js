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
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const authUserSchema = new mongoose.Schema({
    email: {
        type: 'string',
        required: true,
        unique: true
    },
    password: {
        type: 'string',
        required: true
    },
    cPassword: {
        type: 'string',
        required: true
    },
    tokens: [{
            token: {
                type: 'string'
            }
        }]
});
authUserSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(this._id.toString());
            const token = yield jsonWebToken.sign({ _id: this._id.toString() }, "mynameisjaishchimnaniabtechstudent");
            console.log(`token: ${token}`);
            this.tokens = this.tokens.concat({ token: token });
            yield this.save();
            return token;
        }
        catch (e) {
            console.log(e);
        }
    });
};
authUserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const passwordHash = yield bcrypt.hash(this.password, 10);
            console.log(passwordHash);
            this.password = passwordHash;
            this.cPassword = passwordHash;
            next();
        }
    });
});
const authUser = new mongoose.model('Register', authUserSchema);
module.exports = authUser;
