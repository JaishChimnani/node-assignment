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
const cookieParser = require('cookie-parser');
require("./db/connection");
const bodyParser = require("body-parser");
// const userRouter=  require("./routes/routes")
const User = require("./models/User.model");
const authUser = require("./models/Auth.User.model");
const express = require("express");
const bcrypt = require("bcrypt");
const auth = require("./auth");
const sendGrid = require("sendgrid");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
// app.use(userRouter);
app.set('view engine', 'ejs');
app.get('/logout', (req, res) => {
    try {
        res.clearCookie("jwt");
        res.send("logged out");
    }
    catch (error) {
        alert("You must log in before");
        res.redirect("/login");
    }
});
app.get('/', (req, res) => {
    res.render('login');
});
app.get('/Signup', (req, res) => {
    res.render('signup');
    // res.sendFile(__dirname+"/Signup.html");
});
app.get("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('login');
    // res.send("login")
    // res.sendFile(__dirname+"/Login.html");
}));
app.get("/home", auth, (req, res) => {
    res.render("home");
});
app.listen(2000, () => {
    console.log('Express server listening on port 3000');
});
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const user = new User(req.body);
        const result = yield user.save();
        res.render("Hello World");
    }
    catch (err) {
        console.log(err);
    }
}));
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield User.find();
        console.log(result);
    }
    catch (err) {
        console.log(err);
    }
}));
app.get('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield User.findById({ _id: id });
        if (!result) {
            return res.status(404).send();
        }
        else {
            res.send(result);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
//updating by id
app.patch("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield User.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        res.send(result);
    }
    catch (err) {
        res.status(400).send(err);
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        console.log(`${email}+" "+${password}`);
        const result = yield authUser.findOne({ email });
        console.log(result);
        const token = yield result.generateAuthToken();
        console.log(token);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        });
        if (result.email == email && bcrypt.compare(result.password, password)) {
            res.render('home');
        }
        else {
        }
    }
    catch (e) {
        // res.status(400).send(e);
        console.log(e);
    }
}));
app.post("/SignUp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.cPassword;
        const newUser = new authUser({
            email: email,
            password: password,
            cPassword: confirmPassword
        });
        console.log(`${newUser}`);
        const token = yield newUser.generateAuthToken();
        console.log(`token: ${token}`);
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        });
        const result = yield newUser.save();
        res.sendFile(__dirname + "/home.html");
    }
    catch (e) {
        // res.status(400).send(e);
        console.log(e);
    }
}));
// 
// async function CreateUser(){
//     try{
//         const jaish=new User({
//             name:"Ayushi Jaiswal",
//             email:"Ayishi@example.com",
//             phoneNumber:"8"
//         })
//         const result=await jaish.save();
//         console.log(result);
//     }catch(err){
//         console.log(err);
//     }
// }
// const getDocument=async ()=>{
//     const result=await User.find();
//     console.log(result);
// }
// const UpdateUser=async (_id,name)=>{
//     const result=await User.findByIdAndUpdate({_id:_id},{
//         $set:{name:name}
//     });
//     console.log(result);
// }
// const deleteUser=async (id)=>{
//     const result=await User.deleteOne({_id:id});
//     console.log(result);
// }
// // deleteUser("62e7910a7237fd2c808d199e");
// // UpdateUser("62e7910a7237fd2c808d199e","arpit");
// // CreateUser();
// // getDocument();
// // module.exports=router;
