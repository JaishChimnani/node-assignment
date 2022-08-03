require('dotenv').config();
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jsonWebToken=require('jsonwebtoken');

const authUserSchema=new mongoose.Schema({
    email:{
        type:'string',
        required:true,
        unique:true
    },
    password:{
        type:'string',
        required:true
    },
    cPassword:{
        type:'string',
        required:true
    },
    tokens:[{
        token:{
               type:'string'
        }
    }]
})


authUserSchema.methods.generateAuthToken= async function(){
    try{
        console.log(this._id.toString());
        const token = await jsonWebToken.sign({_id:this._id.toString()},"mynameisjaishchimnaniabtechstudent");
        console.log(`token: ${token}`);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;

    }catch(e){
    console.log(e);
    }
}

authUserSchema.pre("save",async function(next){
    if(this.isModified("password")){
    const passwordHash = await bcrypt.hash(this.password,10);
    console.log(passwordHash);
    this.password = passwordHash;
    this.cPassword = passwordHash;
    next();
    }
})

const authUser=new mongoose.model('Register',authUserSchema);
module.exports = authUser;