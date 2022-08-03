const jwt = require('jsonwebtoken');
const authUser= require('./models/Auth.User.model');
const cookieParser =require('cookie-parser');
const auth= async (req, res,next) => {
try {
    console.log("0");
    const token =req.cookies.jwt;
    console.log("1"+token);
    const verifyUser=jwt.verify(token,"mynameisjaishchimnaniabtechstudent");
    console.log("2");
    console.log(verifyUser);
    
    const user = await authUser.findOne({_id:verifyUser._id});
    console.log("3");
    console.log(user);

    req.token=token;
    req.user=user;
    
    next();
    
} catch (error) {
    console.log(error);
}
}

module.exports = auth;