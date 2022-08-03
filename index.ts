require('dotenv').config();
const cookieParser = require('cookie-parser');
require("./db/connection")
const bodyParser=require("body-parser")
// const userRouter=  require("./routes/routes")
const User= require("./models/User.model")
const authUser= require("./models/Auth.User.model");
const express = require("express");
const bcrypt   = require("bcrypt");
const auth = require("./auth");
const sendGrid = require("@sendgrid/mail");
const ExcelJs = require("exceljs");


const API_KEY="";
sendGrid.setApiKey(API_KEY);

var app =express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser());
// app.use(userRouter);
app.set('view engine', 'ejs');


app.get('/addUser',auth, (req, res) => {
    res.render('form');
})
app.get('/getUser',auth, (req, res) => {
    res.render('GetUser');
})
app.post('/getUser',auth,async (req, res) => {
    try{
        const id=req.body.id;
        console.log(id);
        const result= await User.findById({_id:id})
        if(!result){
            return res.status(404).send();
        }else{
            
            res.send(result);
        }
    }catch(err) {
        console.log(err);
    }
})
app.post('/sendMail', async (req, res) => {
    const senderMail=req.body.senderMail;
    const recieverMail = req.body.recieverMail;
    const subject=req.body.subject;
    const text=req.body.text;
    
    const message={
        to:recieverMail,
        from:senderMail,
        subject:subject,
        text:text,
        
    }
    sendGrid.send(message).then(response => {res.send(message);})
    .catch(err => {res.send(err );});
    
})
app.get('/deleteUser',auth,  (req, res)=>{
res.render('deleteUser');
})

app.get("/sendMail",auth, (req, res) => {
    res.render('sendGrid')
})
app.get('/logout', (req, res) => {
    try {
        
        res.clearCookie("jwt");
        // res.send("logged out");
        res.redirect('/login');
    } catch (error) {
        alert("You must log in before")
        res.redirect("/login");
    }
})

app.get('/', (req, res) => {
    res.render('login');
});
app.get('/Signup', (req, res) => {
    res.render('signup');
    // res.sendFile(__dirname+"/Signup.html");
});
app.get("/login", async (req,res)=>{
    res.render('login');
    // res.send("login")
    // res.sendFile(__dirname+"/Login.html");
})
app.get("/home", auth ,(req,res)=>{
res.render("home");
})
app.get("/updateUser", auth ,(req,res)=>{
res.render("UpdateUser");
})

app.listen(2000,()=>{
    console.log('Express server listening on port 3000');
})

app.post('/deleteUser',auth,async (req, res)=>{
    try{

        const id=req.body.id;;
        const result = await User.remove({_id:id});
     res.send(result)   
    }catch(err){
        res.send(err);
    }
})

app.post('/users',async (req, res) => {
    try{
        const email = req.body.email;
        const name = req.body.name;
        const phoneNumber = req.body.phoneNumber;
        const newUser= new User({
            email: email,
            name:name,
            phoneNumber:phoneNumber
        })
        res.send(newUser);
        // console.log(req.body);
        
        // const user=new User(req.body);
        // const result=await user.save();
        // res.send("Hello World");
    }catch(err) {
        console.log(err);
    }
})

app.get('/users',auth,async (req, res) => {
    try{
        const result= await User.find();
        res.send(result);
    }catch(err) {
        console.log(err);
    }
})
app.get('/users/:id',async (req, res) => {
    try{
        const id=req.params.id;
        const result= await User.findById({_id:id})
        if(!result){
            return res.status(404).send();
        }else{
            
            res.send(result);
        }
    }catch(err) {
        console.log(err);
    }
})


//updating by id
app.patch("/users/:id",async (req,res)=>{
    try{
        const id=req.params.id;
        const result= await User.findByIdAndUpdate({_id:id},req.body,{new:true});
        res.send(result);
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/login",async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        
        console.log(`${email}+" "+${password}`);
        
        const result=await authUser.findOne({email});
        
        console.log(result)
        const token=await result.generateAuthToken();
        console.log(token);
               
res.cookie("jwt",token,{
    expires: new Date(Date.now() + 360000),
    httpOnly: true
});

        if(result.email==email && bcrypt.compare(result.password,password) ){
            
            res.render('home');
        }else{
            
        }
        
        
    }catch(e){
        // res.status(400).send(e);
        console.log(e)
    }
})


app.post("/SignUp",async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        const confirmPassword=req.body.cPassword;
        
        const newUser= new authUser({
            email:email,
            password:password,
            cPassword: confirmPassword
        })
        
        console.log(`${newUser}`);
        
        const token =await newUser.generateAuthToken();
        console.log(`token: ${token}`);
        
res.cookie("jwt",token,{
    expires: new Date(Date.now() + 360000),
    httpOnly: true
});

        const result =await newUser.save();
        
        res.sendFile(__dirname+"/home.html")
    }catch(e){
        // res.status(400).send(e);
        console.log(e)
    }
})

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
app.get('/sheet', async (req, res, next) => {
    try {
        const users = await User.find();
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('My Users');
        worksheet.columns = [
            {header: 'S.no', key: 's_no', width: 10},
            {header: 'name', key: 'name', width: 10},
            {header: 'Email', key: 'email', width: 10},
            {header: 'phoneNumber', key: 'phoneNumber', width: 10}
        ];
        let count = 1;
        users.forEach(user => {
            (user as any).s_no = count;
            worksheet.addRow(user);
            count += 1;
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = {bold: true};
        });
        const data = await workbook.xlsx.writeFile('users.xlsx')
        res.send('done');
    } catch (e) {
        res.status(500).send(e);
    }
});