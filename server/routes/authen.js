const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {JWT_SECERET} = require('../valuesKeys')
const requireLogin = require("../middleware/requireLogin");
router.get("/",(req,res)=>{
    res.send("Hello World")
})
router.post("/signup",(req,res)=>{
    const {name,email,password}=req.body
    if(!email || !password || !name){
        res.status(442).json({error:"you will need to give all the information required"});
    }
    User.findOne({email:email}).then((savedUser=>{
        if(savedUser){
            return res.status(422).json({error:"User already exist with this email"});
        }
        bcrypt.hash(password,12).then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
            user.save()
            .then(user=>{
                res.json({message:"user Saved Successfully"})
    
            }).catch(err=>{
                console.log(err);
            })
        })
        
    })).catch(err=>{
        console.log(err);
    })

    //res.json({message:"your data is saved successfully sent"})
    //console.log(req.body.name);
})
router.post("/signin",(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(422).json({eror:"Please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
        return res.status(422).json({error:"Invalid Id or Password"})
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
        if(doMatch){
           //res.json({message:"Successfully Sign in"});
            const token = jwt.sign({_id:savedUser._id},JWT_SECERET);
            res.json({token})

        }
        else{
            return res.status(422).json({error:"Invalid Id or password"});
        }
    })
    .catch(err=>{
        console.log(err)
    })
})

})
router.get("/protected",requireLogin,(req,res)=>{
    res.send("hello user");
})
module.exports = router