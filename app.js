const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = 3000

require('./src/models/userModel')
app.use(express.json())
app.use(require('./src/routes/auth'))

mongoose.connect("mongodb+srv://richardwork:2YLjcp0favzUASR9@cluster3.bli4t.mongodb.net/test?retryWrites=true&w=majority"
     ,{useNewUrlParser:true

})

mongoose.connection.on('connected',()=>{
    console.log('MongoDb Connected Yeah!');
})

mongoose.connection.on('error',(err)=>{
    console.log('error Connecting',err);
})



app.listen(PORT,()=>{
    console.log('Server is Running on',PORT);
})

