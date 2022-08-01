require("./db/connection")
// const userRouter=  require("./routes/routes")
const users= require("./models/User.model")
const express = require("express");

var app =express();
app.use=(express.json());
// app.use(userRouter);


app.get('/', (req, res) => {
    res.sendFile(__dirname+"/Login.html");
});
app.get('/Signup', (req, res) => {
    res.sendFile(__dirname+"/Signup.html");
});


app.listen(2000,()=>{
    console.log('Express server listening on port 3000');
})


app.post('/users',async (req, res) => {
    try{
        console.log(req.body);
        const user=new User(req.body);
        const result=await user.save();
        res.send("Hello");
    }catch(err) {
        console.log(err);
    }
})

app.get('/users',async (req, res) => {
    try{
        const result= await User.find();
        console.log(result);
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