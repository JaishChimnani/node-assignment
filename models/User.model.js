"use strict";
const mongoose = require('mongoose');
// const schema=mongoose.schema();
const UserSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
        max: 100
    },
    email: {
        type: 'string'
    },
    phoneNumber: {
        type: 'number',
        max: 10
    }
});
const User = new mongoose.model("User", UserSchema);
module.exports = User;
