const express  = require('express')
const  mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../../keys')
const authorization = require('../middleware/requiredLogin')

router.get('/protected',authorization,(req,res)=>{
    res.send('hello User')
})


//Sign Up
router.post('/signup',(req,res)=>{
 const {name ,email,password} = req.body
 if(!name || !email || !password){

 return res.status(422).json({error:"please  add all the fields"})
 }
 User.findOne({email:email})
 .then((savedUser)=>{
    if(savedUser){
     return res.status(422).json({error:"user already exists with this email"})
    }
    bcrypt.hash(password,12)
    .then(hasedpassword=>{

        const user = new User({
            email,
            password:hasedpassword,
            name
        })
    
        user.save()
        .then( user =>{
            res.json({message:"saved Succesfully"})
        })
        .catch(err=>{
            console.log(err);
        })

    })
   
 })
 .catch(err =>{
    console.log(err);
 })
})
//Sign In
router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
      return res.status(422).json({error:'please enter email and password'})
    }
User.findOne({email:email})
.then(savedUser=>{
    if(!savedUser){
       return res.status(422).json({error:"Invaid email or password"})
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
        if(doMatch){
           
          //  res.json({message:"succefully signedIn"})
      
          const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
          res.json({token})
        }
        else{
            return res.status(422).json({error:"Invaid email or password"})
        }
    })
    .catch(err=>{
        console.log(err);
    })
})
})




module.exports = router